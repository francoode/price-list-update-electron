const Database = require('./database');
const Jimp = require('jimp');

const {remote} = require('electron');
const dialog = remote.dialog;
const win = remote.getCurrentWindow();

window.addEventListener('load', async () => {
    try {
        const db = await Database.getInstance();
        const products = await db.getAllProducts();

        products.forEach((p) => {
            insertRow(p);
        })

        await setParameter();
    } catch (e) {
        console.log(e);
    }

});

document.getElementById('process').addEventListener('click', async () => {
    try {
        const db = await Database.getInstance();
        const products = await db.getAllProducts();

        let path = '';
        const parameters = await db.getParameters();
        if(parameters && Array.isArray(parameters) && parameters[0]) {
            path = parameters[0].base_path;
        }

        if(!path) {
            throw new Error('No path for images');
        }

        if (products.length >= 1) {
            for (const p of products) {
                try {
                    const price = document.getElementById(`price-${p.id}`).value;
                    if (price) {
                        const path = `${path}/img/${p.path}`;
                        const image = await Jimp.read(path);
                        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                        await image.resize(600, 600);
                        await image.print(font, 65, 500, `$${price}`);
                        await image.write(`${path}/out/${p.name}.jpg`);

                        document.getElementById(`result-${p.id}`).innerHTML = `<span class="icon icon-check success"></span>`
                    } else {
                        document.getElementById(`result-${p.id}`).innerHTML = `<span class="icon icon-cancel error"></span>`
                    }
                } catch (e) {
                    document.getElementById(`result-${p.id}`).innerHTML = `<span class="icon icon-cancel error"></span>`
                    console.log(e);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
});

document.getElementById('form-new-product').addEventListener('submit', async (event) => {
    try {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const path = document.getElementById('product-file').files[0].name;

        if (!name || !path) {
            throw new Error('Invalid value');
        }

        const db = await Database.getInstance();
        const id = await db.insertProduct(name, path);

        insertRow({id, name, path});
        document.getElementById('form-new-product').reset();
        document.getElementById('form-message-success').style.display = 'block';
        document.getElementById('form-message-error').style.display = 'none';

        return false;
    } catch (e) {
        document.getElementById('form-message-success').style.display = 'none';
        document.getElementById('form-message-error').style.display = 'block';
        document.getElementById('form-message-error').innerHTML = `<span class="icon icon-cancel"></span> ${e.toString()}`
        document.getElementById('form-new-product').reset();
    }
})

document.getElementById('tab-new').addEventListener('click', () => {
    const form = document.getElementById('container-product-form');
    const list = document.getElementById('container-list');

    form.style.display = 'block';
    list.style.display = 'none';
})

document.getElementById('tab-list').addEventListener('click', () => {
    const form = document.getElementById('container-product-form');
    const list = document.getElementById('container-list');

    form.style.display = 'none';
    list.style.display = 'block';
})

function insertRow(product) {
    const tableRef = document.getElementById('products-list');
    const idx = tableRef.rows.length;
    const newRow = tableRef.insertRow(idx);

    const cellName = newRow.insertCell();
    cellName.appendChild(document.createTextNode(product.name));

    const cellPath = newRow.insertCell();
    cellPath.appendChild(document.createTextNode(product.path));

    const cellPrice = newRow.insertCell();
    const priceElement = document.createElement("input");
    priceElement.setAttribute('type', 'text');
    priceElement.setAttribute('id', `price-${product.id}`);
    priceElement.setAttribute('required', 'true');
    cellPrice.appendChild(priceElement);

    const cellResult = newRow.insertCell();
    const resultElement = document.createElement('span');
    resultElement.setAttribute('id', `result-${product.id}`);
    resultElement.innerHTML = `<span id="delete-${product.id}" class="icon icon-trash"></span>`

    cellResult.appendChild(resultElement);

    document.getElementById(`delete-${product.id}`).addEventListener('click', async () => {
        const db = await Database.getInstance();
        await db.removeProduct(product.id);
        tableRef.deleteRow(idx)
    })
}

document.getElementById('img-directory').addEventListener('click', async (event) => {
    event.preventDefault();
    const {filePaths} = await dialog.showOpenDialog(win, {properties: ['openDirectory']});


    if (filePaths) {
        const db = await Database.getInstance();
        await db.saveParameter(filePaths);
        await setParameter();
    }
})

async function setParameter() {
    const db = await Database.getInstance();
    const parameters = await db.getParameters();
    if(parameters && Array.isArray(parameters) && parameters[0]) {
        document.getElementById('img-directory-actual').innerText = parameters[0].base_path;
    }
}



