import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('mywine.db');
type Wine = {
    name: string;
    image: string;
    color: string;
    region: string;
    year: number;
    grape: string;
    code: string;
    quantity: number;
};

function initDatabase() {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS wines (id INTEGER PRIMARY KEY AUTOINCREMENT, names TEXT NOT NULL, images BLOB, colors TEXT, regions TEXT, years YEAR, grapes TEXT,codes TEXT,quantities NUMBER)',
            [],
            () => console.log("db initialisée"),
            (tx, error) => {
                console.log(`Erreur à l'initialisation de la database: ${error.message}`);
                return true;
            }
        );
    });
}

function addWineToDb(wine: Wine) {
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO wines (names, images, colors, regions, years, grapes, codes, quantities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [wine.name, wine.image, wine.color, wine.region, wine.year, wine.grape, wine.code, wine.quantity],
            (_, result) => console.log(`vin ajouté avec l'id: ${result.insertId}`),
            (_, error) => {
                console.log(`Erreur lors de l'ajout du vin à la db: ${error.message}`)
                return true;
            }
        );
    })
}

function getAllWines(callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines',
            [],
            (_, {rows}) => {
                callback(rows._array);
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver les vins: ${error.message}`);
                return true;
            }
        );

    });
}

function removeWineToDb(wineId: number, quantityToRemove: number) {
    db.transaction((tx) => {
        tx.executeSql(
            'UPDATE wines SET quantities = quantities - ? WHERE id = ?',
            [quantityToRemove, wineId],
            (_, result) => console.log(`quantité diminuée de ${quantityToRemove} pour le vin: ${result}`),
            (_, error) => {
                console.log(`Erreur lors de la diminution de 1: ${error.message}`)
                return true;
            }
        );
    })
}

function dropTable() {
    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE wines',
        )
    })
    console.log('drop table appelé')
}

export default {
    initDatabase,
    addWineToDb,
    getAllWines,
    dropTable,
    removeWineToDb,
};