const Database = require('./database');
const Jimp = require('jimp');

window.addEventListener('load', async () => {
    const db = await Database.getInstance();
    const products = await db.getAllProducts();
    const tableRef = document.getElementById('products-list');
    console.log(products);
    products.forEach((p, index) => {

        const newRow   = tableRef.insertRow(index);

        const cellName = newRow.insertCell(0);
        cellName.appendChild(document.createTextNode(p.name));

        const cellPath = newRow.insertCell(1);
        cellPath.appendChild(document.createTextNode(p.path));
    })
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
        const file = document.getElementById('product-file').files[0].name;

        const db = await Database.getInstance();
        const product = await db.insertProduct(name, file);
        const products = await db.getAllProducts();

        console.log(products);

        return false;
    } catch (e) {
        console.log(e);
    }
})