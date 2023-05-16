import * as SQLite from 'expo-sqlite'
import {DISHES} from "../Components/ExportedLists/ExportedLists";

const db = SQLite.openDatabase('mywine.db');

type Wine = {
    name: string;
    image: string;
    color: string;
    country_id: number;
    region_id: number;
    year: number;
    grape: string;
    code: string;
    quantity: number;
    review?: string;
    rating?: number;
};

//Initialisation de la db
function initDatabase() {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS wines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                names TEXT NOT NULL, 
                images BLOB,
                colors TEXT,
                country_id INTEGER,
                region_id INTEGER,
                years YEAR,
                grapes TEXT,
                codes TEXT,
                quantities NUMBER,
                reviews TEXT,
                ratings NUMBER
            ); `,
            [],
            () => {
                console.log("db 1 initialisée");
            },
            (tx, error) => {
                console.log(`Erreur à l'initialisation de la database: ${error.message}`);
                return true;
            }
        );
    });
}

function initCountriesDatabase() {
    db.transaction(tx => {
        tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS countries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            );`,
            [],
            () => {
                console.log("db Countries initialisée");
            },
            (tx, error) => {
                console.log(`Erreur à l'initialisation de la database: ${error.message}`);
                return true;
            }
        );
    });
}

function initRegionsDatabase() {
    db.transaction(tx => {
        tx.executeSql(
            `
             CREATE TABLE IF NOT EXISTS regions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                country_id INTEGER,
                FOREIGN KEY (country_id) REFERENCES countries(id)
            );`,
            [],
            () => {
                console.log("db Regions initialisée");
            },
            (tx, error) => {
                console.log(`Erreur à l'initialisation de la database: ${error.message}`);
                return true;
            }
        );
    });
}


//création de la table des plats qui possède un nom, un id de pays et un id de région
function initDishesDatabase() {
    db.transaction(tx => {
        tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS dishes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                country_id INTEGER,
                region_id INTEGER,
                color TEXT,
                FOREIGN KEY (country_id) REFERENCES countries(id),
                FOREIGN KEY (region_id) REFERENCES regions(id)
            );`,
            [],
            () => {
                console.log("db Dishes initialisée");
            },
            (tx, error) => {
                console.log(`Erreur à l'initialisation de la database: ${error.message}`);
                return true;
            }
        );
    });
}


//Ajout des régions viticole en fonction des pays
function addCountriesAndWineRegions() {
    const countries = [
        {
            name: "France",
            regions: ["Aquitaine", "Alsace", "Beaujolais", "Bordeaux", "Bourgogne", "Champagne", "Corse", "Jura", "Languedoc-Roussillon", "Loire", "Provence", "Rhône", "Savoie", "Sud-Ouest", "Vallée de la Loire", "Vallée du Rhône", "Autre"]
        },
        {
            name: "Belgique",
            regions: ["Flandre occidentale", "Flandre orientale", "Anvers", "Limbourg", "Liège", "Namur", "Brabant flamand", "Brabant wallon", "Hainaut", "Luxembourg", "Autre"]
        },
        {
            name: "Italie",
            regions: ["Toscane", "Piemont", "Vénétie", "Sicile", "Frioul-Vénétie Julienne", "Lombardie", "Ombrie", "Abruzzes", "Marches", "Ligurie", "Campanie", "Trentin-Haut-Adige", "Émilie-Romagne", "Calabre", "Pouilles", "Val d'Aoste", "Basilicate", "Sardaigne", "Molise", "Lazio", "Vallée d'Aoste", "Autre"]
        },
        {
            name: "Espagne",
            regions: ["Andalousie", "Aragon", "Asturies", "Îles Baléares", "Canaries", "Cantabrie", "Castille et León", "Castille-La Manche", "Catalogne", "Estrémadure", "Galice", "Madrid", "Murcie", "Navarre", "La Rioja", "Pays basque", "Communauté valencienne", "Estrémadure", "Ceuta", "Melilla"]
        },
    ];

    db.transaction(tx => {
        for (const country of countries) {
            // Vérifier si le pays existe déjà dans la table "countries"
            tx.executeSql(
                `SELECT * FROM countries WHERE name = ?`,
                [country.name],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        console.log(`Le pays ${country.name} existe déjà dans la base de données.`);
                        return;
                    }

                    // Ajouter le pays s'il n'existe pas encore
                    tx.executeSql(
                        `INSERT INTO countries (name) VALUES (?)`,
                        [country.name],
                        (tx, results) => {
                            const countryId = results.insertId;
                            if (!countryId) {
                                return;
                            }

                            // Ajouter les régions en fonction du pays actuel
                            for (const region of country.regions) {
                                // Vérifier si la région existe déjà dans la table "regions"
                                tx.executeSql(
                                    `SELECT * FROM regions WHERE name = ? AND country_id = ?`,
                                    [region, countryId],
                                    (tx, results) => {
                                        if (results.rows.length > 0) {
                                            console.log(`La région ${region} existe déjà pour le pays ${country.name}.`);
                                            return;
                                        }

                                        // Ajouter la région s'elle n'existe pas encore
                                        tx.executeSql(
                                            `INSERT INTO regions (name, country_id) VALUES (?, ?)`,
                                            [region, countryId],
                                            (tx, results) => {
                                                console.log(`Région ${region} ajoutée pour le pays ${country.name} avec l'ID ${results.insertId}`);
                                            },
                                            (tx, error) => {
                                                console.log(`Erreur lors de l'ajout de la région ${region} pour le pays ${country.name}: ${error.message}`);
                                                return true;
                                            }
                                        );
                                    },
                                    (tx, error) => {
                                        console.log(`Erreur lors de la vérification de la région ${region} pour le pays ${country.name}: ${error.message}`);
                                        return true;
                                    }
                                );
                            }
                        },
                        (tx, error) => {
                            console.log(`Erreur lors de l'ajout du pays ${country.name}: ${error.message}`);
                            return true;
                        }
                    );
                },
                (tx, error) => {
                    console.log(`Erreur lors de la vérification du pays ${country.name}: ${error.message}`);
                    return true;
                }
            );
        }
    });
}

function addDishes() {
    db.transaction(tx => {
        DISHES.forEach(dish => {
            // Vérifier si le plat existe déjà dans la table "dishes"
            tx.executeSql(
                `SELECT * FROM dishes WHERE name = ?`,
                [dish.name],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        console.log(`Le plat ${dish.name} existe déjà dans la base de données.`);
                        return;
                    }
                    tx.executeSql(
                        `INSERT INTO dishes (name, country_id,region_id, color) VALUES (?, ?, ?, ?);`,
                        [dish.name, dish.country_id, dish.region_id, dish.color],
                        () => {
                            console.log(`Plat ajouté : ${dish.name}`);
                        },
                        (tx, error) => {
                            console.log(`Erreur lors de l'ajout du plat : ${dish.name} - ${error.message}`);
                            return true;
                        }
                    );
                },

                (tx, error) => {
                    console.log(`Erreur lors de la vérification du plat ${dish.name}: ${error.message}`);
                    return true;
                },
            )

        });
    });
}

function getAllCountries(callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM countries',
            [],
            (_, {rows}) => {
                callback(rows._array);
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver les pays: ${error.message}`);
                return true;
            }
        );

    });
}

function getAllRegionsByCountryId(countryId: number, callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM regions WHERE country_id = ?',
            [countryId],
            (_, {rows}) => {
                callback(rows._array);
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver les regions du pays avec l'id ${countryId}: ${error.message}`);
                return true;
            }
        );

    });
}


//Insertion de vin
function addWineToDb(wine: Wine) {
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO wines (names, images, colors,country_id, region_id, years, grapes, codes, quantities) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)',
            [wine.name, wine.image, wine.color, wine.country_id, wine.region_id, wine.year, wine.grape, wine.code, wine.quantity],
            (_, result) => console.log(`vin ajouté avec l'id: ${result.insertId}`),
            (_, error) => {
                console.log(`Erreur lors de l'ajout du vin à la db: ${error.message}`)
                return true;
            }
        );
    })
}

function addReviewToWine(id: number, review: string, rating: number) {
    db.transaction((tx) => {
        tx.executeSql(
            'UPDATE wines SET reviews = ?, ratings = ? WHERE id = ?',
            [review, rating, id],
            (_, result) => console.log(`Avis ajouté`),
            (_, error) => {
                console.log(`Erreur lors de l'ajout de l'avis à la db: ${error.message}`);
                return true;
            }
        );
    });
}


//fetch tout les vins
function getAllWines(callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines WHERE quantities != 0',
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

function getLength(): Promise<number> {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT COUNT(*) as count FROM wines',
                [],
                (_, {rows}) => {
                    if (rows.length > 0) {
                        resolve(rows.item(0).count);
                    } else {
                        resolve(0);
                    }
                },
                (tx, error) => {
                    console.log(`Erreur pour compter les vins: ${error.message}`);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

function getDishesLength(): Promise<number> {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT COUNT(*) as count FROM dishes',
                [],
                (_, {rows}) => {
                    if (rows.length > 0) {
                        resolve(rows.item(0).count);
                    } else {
                        resolve(0);
                    }
                },
                (tx, error) => {
                    console.log(`Erreur pour compter les plats: ${error.message}`);
                    reject(error);
                    return false;
                }
            );
        });
    });
}


function getWineByBarcode(barcode: string, callback: (result: any[]) => void) {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines WHERE codes = ?',
            [barcode],
            (_, {rows}) => {
                const result = rows.length > 0 ? rows.item(0) : null;
                callback(result);
            },
            (_, error) => {
                console.error(error);
                return false;
            },
        );
    });
}

function getWineById(id: number, callback: (result: any[]) => void) {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines WHERE id = ? AND quantities != 0',
            [id],
            (_, {rows}) => {
                const result = rows.length > 0 ? rows.item(0) : null;
                callback(result);
            },
            (_, error) => {
                console.error(error);
                return false;
            },
        );
    });
}

function getDishesById(id: number, callback: (result: any[]) => void) {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM dishes WHERE id = ?',
            [id],
            (_, {rows}) => {
                const result = rows.length > 0 ? rows.item(0) : null;
                callback(result);
            },
            (_, error) => {
                console.error(error);
                return false;
            },
        );
    });
}


function getAllReviews(callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines WHERE reviews IS NOT null',
            [],
            (_, {rows}) => {
                callback(rows._array);
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver les avis: ${error.message}`);
                return true;
            }
        );

    });
}

function getSuggestionByWine(country: number, region: number, color: string, callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM dishes WHERE country_id = ? AND region_id = ? AND color = ? ',
            [country, region, color],
            (_, {rows}) => {
                callback(rows._array);
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver les plats: ${error.message}`);
                return true;
            }
        );

    });
}

function getWinesBySuggestion(country: number, region: number, color: string, callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines WHERE country_id = ? AND region_id = ? AND colors = ? LIMIT 3',
            [country, region, color],
            (_, {rows}) => {
                if (rows._array.length === 0) {
                    // Si la première requête ne renvoie aucun résultat, on exécute une deuxième requête sans le `region_id`
                    tx.executeSql(
                        'SELECT * FROM wines WHERE country_id = ? AND colors = ? LIMIT 3',
                        [country, color],
                        (_, {rows}) => {
                            if (rows._array.length === 0) {
                                tx.executeSql(
                                    'SELECT * FROM wines WHERE colors = ? LIMIT 3',
                                    [color],
                                    (_, {rows}) => {
                                        callback(rows._array);
                                    },
                                    (tx, error) => {
                                        console.log(`Erreur pour retrouver des vins avec color: ${error.message}`);
                                        return true;
                                    }
                                );
                            } else {
                                callback(rows._array);
                            }
                        },
                        (tx, error) => {
                            console.log(`Erreur pour retrouver des vins avec un country id et color: ${error.message}`);
                            return true;
                        }
                    );
                } else {
                    callback(rows._array);
                }
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver des vins avec un country id, region id et color : ${error.message}`);
                return true;
            }
        );
    });
}

function getWineByColor(color: string, callback: (result: any[]) => void): void {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM wines WHERE colors = ? ',
            [color],
            (_, {rows}) => {
                callback(rows._array);
            },
            (tx, error) => {
                console.log(`Erreur pour retrouver les vins avec la couleur ${color}: ${error.message}`);
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
            (_, result) => console.log(`quantité diminuée de ${quantityToRemove} pour le vin à l'id :${wineId}`),
            (_, error) => {
                console.log(`Erreur lors de la diminution de 1: ${error.message}`)
                return true;
            }
        );
    })
}

function removeWineById(id: number, quantityToRemove: number) {
    db.transaction((tx) => {
        tx.executeSql(
            'UPDATE wines SET quantities = quantities - ? WHERE id = ?',
            [quantityToRemove, id],
            (_, result) => console.log(`quantité diminuée de ${quantityToRemove} pour le vin :${id}`),
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
    console.log('Drop table appelé')
}

function dropCountriesTable() {
    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE countries',
        )
    })
    console.log('Drop table appelé')
}

function dropRegionsTable() {
    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE regions',
        )
    })
    console.log('Drop table appelé')
}

function dropDishesTable() {
    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE dishes',
        )
    })
    console.log('Drop table appelé')
}

function getCountryRegionNames() {
    db.transaction(tx => {
        tx.executeSql(
            `
    SELECT wines.id, wines.names, countries.name AS country_name, regions.name AS region_name
    FROM wines
    LEFT JOIN countries ON wines.country_id = countries.id
    LEFT JOIN regions ON wines.region_id = regions.id;
    `,
            [],
            (tx, results) => {
                const wines = results.rows; // récupérer les données de la réponse SQL
                console.log(wines); // afficher les données dans la console
            },
            (tx, error) => {
                console.log(`Erreur SQL : ${error.message}`);
                return false;
            }
        );
    });
}


export default {
    initDatabase,
    initRegionsDatabase,
    initCountriesDatabase,
    initDishesDatabase,
    addWineToDb,
    getAllWines,
    dropTable,
    dropRegionsTable,
    dropCountriesTable,
    dropDishesTable,
    removeWineToDb,
    removeWineById,
    getWineByBarcode,
    addReviewToWine,
    getAllReviews,
    getLength,
    getWineById,
    getAllCountries,
    addCountriesAndWineRegions,
    getAllRegionsByCountryId,
    addDishes,
    getSuggestionByWine,
    getWineByColor,
    getDishesById,
    getDishesLength,
    getWinesBySuggestion,
};