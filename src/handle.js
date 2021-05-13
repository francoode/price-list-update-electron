const Database = require('./database');
const Jimp = require('jimp');

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

        console.log(product);

        return false;
    } catch (e) {
        console.log(e);
    }
})