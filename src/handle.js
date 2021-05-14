const Database = require('./database');
const Jimp = require('jimp');

window.addEventListener('load', async () => {
    try {
        const db = await Database.getInstance();
        const products = await db.getAllProducts();

        products.forEach((p) => {
            insertRow(p);
        })
    } catch (e) {
        console.log(e);
    }

});

document.getElementById('process').addEventListener('click', async () => {
    try {
        const db = await Database.getInstance();
        const products = await db.getAllProducts();

        if (products.length >= 1) {
            for (const p of products) {
                try {
                    const path = `${__dirname}/img/${p.path}`;
                    const image = await Jimp.read(path);
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
                    const price = document.getElementById(`price-${p.id}`).value;
                    await image.print(font, 100, 500, price);
                    await image.write(`${__dirname}/out/${p.name}.jpg`);

                    document.getElementById(`result-${p.id}`).innerHTML = `<span class="icon icon-check success"></span>`
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
    const newRow = tableRef.insertRow(tableRef.rows.length);

    const cellName = newRow.insertCell();
    cellName.appendChild(document.createTextNode(product.name));

    const cellPath = newRow.insertCell();
    cellPath.appendChild(document.createTextNode(product.path));

    const cellPrice = newRow.insertCell();
    const priceElement = document.createElement("input");
    priceElement.setAttribute('type', 'number');
    priceElement.setAttribute('id', `price-${product.id}`);
    priceElement.setAttribute('required', 'true');
    cellPrice.appendChild(priceElement);

    const cellResult = newRow.insertCell();
    const resultElement = document.createElement('span');
    resultElement.setAttribute('id', `result-${product.id}`);
    resultElement.innerHTML = `<span id="delete-${product.id}" class="icon icon-trash"></span>`

    cellResult.appendChild(resultElement);
}