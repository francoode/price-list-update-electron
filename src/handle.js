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

document.getElementById('click').addEventListener('click', () => {

    Jimp.read(`${__dirname}/test.jpeg`)
        .then((image) => {
            Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(font => {
                image.print(font, 100, 500, 'hello');
            }).then(() => {
                image.write('jeje.jpeg');
            })
        })
        .catch((e) => console.log(e));
});

document.getElementById('form-new-product').addEventListener('submit', async (event) => {
    try {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const path = document.getElementById('product-file').files[0].name;

        if(!name || !path) {
            throw new Error('Invalid value');
        }

        const db = await Database.getInstance();
        const id = await db.insertProduct(name, path);

        insertRow({id, name, path});

        document.getElementById("form-new-product").reset();

        return false;
    } catch (e) {
        console.log(e);
        document.getElementById("form-new-product").reset();
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
    const newRow   = tableRef.insertRow(tableRef.rows.length);

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
}