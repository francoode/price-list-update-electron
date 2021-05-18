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

        const createStamenParameters = `CREATE TABLE IF NOT EXISTS parameters (id INTEGER PRIMARY KEY, base_path TEXT NOT NULL UNIQUE)`
        this.db.run(createStamenParameters);
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

    async saveParameter(basePath) {
        return new Promise((resolve, reject) => {
                this.db.run('REPLACE into parameters(id, base_path) values(1, ?);', [basePath], function (err) {
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

    getParameters() {
        return new Promise((resolve, reject) => {
                this.db.all('SELECT * FROM parameters where id=1 LIMIT 1', (err, rows) => {
                    if (err) {
                        reject(err.toString())
                    } else {
                        resolve(rows);
                    }
                })
            }
        )
    }

    removeProduct(id) {
        return new Promise((resolve, reject) => {
                this.db.run(`DELETE FROM products WHERE id=?`,[id], function (err) {
                    if (err) {
                        reject(err.toString())
                    } else {
                        console.log('Row remove from the table');
                        resolve()
                    }
                })
            }
        )
    }
}


