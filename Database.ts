import SQLite, { SQLiteDatabase, ResultSet, Transaction } from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'Reactoffline.db';

export interface Product {
    prodId: string;
    prodName: string;
    prodDesc: string;
    prodImage: string;
    prodPrice: string;
}

export default class Database {
    initDB(): Promise<SQLiteDatabase> {
        return new Promise((resolve, reject) => {
            (SQLite as any).echoTest()
                .then(() => {
                    SQLite.openDatabase({
                        name: database_name,
                        location: 'default',
                    })
                        .then((db) => {
                            db.executeSql('SELECT 1 FROM Product LIMIT 1')
                                .then(() => {
                                    resolve(db);
                                })
                                .catch(() => {
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            'CREATE TABLE IF NOT EXISTS Product (prodId TEXT PRIMARY KEY NOT NULL, prodName TEXT, prodDesc TEXT, prodImage TEXT, prodPrice TEXT)'
                                        );
                                    })
                                        .then(() => resolve(db))
                                        .catch((err) => reject(err));
                                });
                        })
                        .catch((err: any) => reject(err));
                })
                .catch((err: any) => reject(err));
        });
    }

    closeDatabase(db: SQLiteDatabase | null): void {
        if (db) {
            db.close()
                .then(() => console.log('Database CLOSED'))
                .catch((error) => console.log('Close DB error:', error));
        } else {
            console.log('Database was not OPENED');
        }
    }

    listProduct(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            const products: Product[] = [];
            this.initDB()
                .then((db) => {
                    db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM Product', []).then(([_, results]) => {
                            const len = results.rows.length;
                            for (let i = 0; i < len; i++) {
                                const row = results.rows.item(i);
                                products.push({
                                    prodId: row.prodId,
                                    prodName: row.prodName,
                                    prodDesc: row.prodDesc,
                                    prodImage: row.prodImage,
                                    prodPrice: row.prodPrice,
                                });
                            }
                            resolve(products);
                        });
                    })
                        .then(() => this.closeDatabase(db))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }

    productById(id: string): Promise<Product> {
        return new Promise((resolve, reject) => {
            this.initDB()
                .then((db) => {
                    db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([_, results]) => {
                            if (results.rows.length > 0) {
                                resolve(results.rows.item(0));
                            } else {
                                reject('Product not found');
                            }
                        });
                    })
                        .then(() => this.closeDatabase(db))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }

    addProduct(prod: Product): Promise<ResultSet> {
        return new Promise((resolve, reject) => {
            this.initDB()
                .then((db) => {
                    db.transaction((tx) => {
                        tx.executeSql(
                            'INSERT INTO Product (prodId, prodName, prodDesc, prodImage, prodPrice) VALUES (?, ?, ?, ?, ?)',
                            [prod.prodId, prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice]
                        ).then(([_, result]) => resolve(result));
                    })
                        .then(() => this.closeDatabase(db))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }

    updateProduct(id: string, prod: Product): Promise<ResultSet> {
        return new Promise((resolve, reject) => {
            this.initDB()
                .then((db) => {
                    db.transaction((tx) => {
                        tx.executeSql(
                            'UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE prodId = ?',
                            [prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice, id]
                        ).then(([_, result]) => resolve(result));
                    })
                        .then(() => this.closeDatabase(db))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }

    deleteProduct(id: string): Promise<ResultSet> {
        return new Promise((resolve, reject) => {
            this.initDB()
                .then((db) => {
                    db.transaction((tx) => {
                        tx.executeSql('DELETE FROM Product WHERE prodId = ?', [id]).then(([_, result]) => {
                            resolve(result);
                        });
                    })
                        .then(() => this.closeDatabase(db))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }
}
