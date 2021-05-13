const sqlite3 = require('sqlite3').verbose();

module.exports = class Database {
    static instance;
    db;

    static async getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
            await this.instance.init();
        }

        return Database.instance;
    }

    async init() {
        this.db = new sqlite3.Database('./db', (err) => {
            if (err) return console.error(err.message);
            console.log('Connected to SQlite database.');
        });

        this.createTable();
    }

    getDb() {
        return this.db;
    }

    createTable() {
        const createStamen = `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, path TEXT NOT NULL UNIQUE)`
        this.db.run(createStamen);
    }

    async insertProduct(name, file) {
        return new Promise((resolve, reject) => {
                this.db.run('INSERT INTO products(name, path) VALUES (?, ?); SELECT last_insert_rowid();', [name, file], function (err) {
                    if (err) {
                        reject(err.toString())
                    } else {
                        console.log('Row was added to the table');
                        resolve(this.lastID)
                    }
                })
            }
        )

    }

    getAllProducts() {
        return new Promise((resolve, reject) => {
                this.db.all('SELECT * FROM products', (err, rows) => {
                    if (err) {
                        reject(err.toString())
                    } else {
                        resolve(rows);
                    }
                })
            }
        )
    }
}


