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

        await this.createTable();
    }

    getDb() {
        return this.db;
    }

    async createTable() {
        const createStamen = `CREATE TABLE IF NOT EXISTS products (name TEXT NOT NULL UNIQUE, path TEXT NOT NULL UNIQUE)`
        await this.db.run(createStamen);
    }

    async insertProduct(name, file) {
        this.db.run('INSERT INTO products VALUES (?, ?)', [name, file], (err) => {
            if (err) {
                throw new Error(err.toString());
            } else {
                console.log('Row was added to the table');
            }
        });
    }

    getAllProducts() {
        return new Promise(resolve => {
                this.db.all('SELECT * FROM products', (err, rows) => {
                    if (err) {
                        throw new Error(err.toString());
                    } else {
                        resolve(rows);
                    }
                })
            }
        )
    }
}


