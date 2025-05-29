const mongoConfig = require('../config/config_mongo');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
const dbName = mongoConfig.dbName;
let dbo;
let bestCollection;
let assocCollection;
let logsCollection;
let bestCollectionMain;
let identCollection;

const collectionsSettings = new Map();
const collectionsConnections = new Map();

(function mongo_starter() {
    MongoClient.connect(urlDB, {   // + '/' + dbName, {
        useUnifiedTopology: true, useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Connected successfully to db");
            dbo = db.db();
            bestCollection = dbo.collection(mongoConfig.bestCollection);
            assocCollection = dbo.collection(mongoConfig.assocCollection);
            bestCollectionMain = dbo.collection(mongoConfig.mainCollection);
            identCollection = dbo.collection(mongoConfig.identCollection);
            bestCollectionMain.createIndex({'LocalHl': 1});
            bestCollection.createIndex({'localHl': 1});
            bestCollection.createIndex({'genre': 1});
            assocCollection.createIndex({'genre': 1});
            assocCollection.createIndex({'LocalHl': 1});
        }
    })
})();

//add/edit new record to game list
async function createRecord(record) {
    try {
        const recordExists = await checkRecordExistence(record.fullUrl);
        if (recordExists) {
            bestCollection.replaceOne({
                fullUrl: record.fullUrl
            }, record);
        } else {
            await bestCollection.insertOne(record);
        }
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function checkRecordExistence(fullUrl) {
    try {
        const dbRequest = await bestCollection.find({'fullUrl': fullUrl}).toArray();
        return Boolean(dbRequest.length);
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByGenre(localHl, genre) {
    try {
        return await bestCollection.find({'genre': genre, 'localHl': localHl}).toArray();
        ;
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByLocalHl(localHl) {
    try {
        let projectionGenre
        switch (localHl) {
            case 'en':
                projectionGenre = "Casino"
                break
            case 'uk':
                projectionGenre = "Казино"
                break
            case 'ru':
                projectionGenre = "Казино"
                break
            case 'nl':
                projectionGenre = "Casino"
                break
            case 'zh-cn':
                projectionGenre = "赌场"
                break
            case 'ja':
                projectionGenre = "カジノ"
                break
            case 'es-mx':
                projectionGenre = "Casino"
                break
            case 'ko':
                projectionGenre = "카지노"
                break
            case 'fr':
                projectionGenre = "Casino"
                break
            case 'tr':
                projectionGenre = "Kumarhane Oyunları"
                break
            case 'ms':
                projectionGenre = "Casino"
                break
            case 'hi':
                projectionGenre = "Казино"
                break
            case 'pt-br':
                projectionGenre = "Cassino"
                break
            case 'es':
                projectionGenre = "Casino"
                break
            case 'it':
                projectionGenre = "Casinò"
                break
            default:
                projectionGenre = "Casino"
                break
        }

        return await bestCollection.find({$and: [{localHl: localHl}, {genre: {$ne: projectionGenre}}]}, {
            projection: {_id: 0}
        }).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByLocalGl(localGl) {
    try {
        return await bestCollection.find({'localGl': localGl}).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getMainByLocalHl(LocalHl) {
    try {
        return await bestCollectionMain.find({'local': LocalHl}, {
            projection: {_id: 0}
        }).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getCatalogByLocalHl(LocalHl) {
    try {
        let projectionGenre
        switch (LocalHl) {
            case 'en':
                projectionGenre = "Casino"
                break
            case 'uk':
                projectionGenre = "Казино"
                break
            case 'ru':
                projectionGenre = "Казино"
                break
            case 'nl':
                projectionGenre = "Casino"
                break
            case 'zh-cn':
                projectionGenre = "赌场"
                break
            case 'ja':
                projectionGenre = "カジノ"
                break
            case 'es-mx':
                projectionGenre = "Casino"
                break
            case 'ko':
                projectionGenre = "카지노"
                break
            case 'fr':
                projectionGenre = "Casino"
                break
            case 'tr':
                projectionGenre = "Kumarhane Oyunları"
                break
            case 'ms':
                projectionGenre = "Casino"
                break
            case 'hi':
                projectionGenre = "Казино"
                break
            case 'pt-br':
                projectionGenre = "Cassino"
                break
            case 'es':
                projectionGenre = "Casino"
                break
            case 'it':
                projectionGenre = "Casinò"
                break
            default:
                projectionGenre = "Casino"
                break
        }

        return await assocCollection.find({$and: [{LocalHl: LocalHl}, {genre: {$ne: projectionGenre}}]}, {
            projection: {_id: 0}
        }).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}


async function getRecordsArray() {
    try {
        return await bestCollection.find({}).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function deleteRecord(fullUrl) {
    try {
        const recordExists = await checkRecordExistence(fullUrl);
        if (recordExists) {
            await bestCollection.deleteOne({fullUrl: fullUrl});
        }
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

//logging
function insertLog(adminName, user, action, system, description) {
    try {
        logsCollection.insertOne({
            adminName,
            user,
            action,
            system,
            description,
            createdAt: new Date()
        });
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function createIdAssociation(uniqueID, genre, LocalHl) {
    try {
        assocCollection.find({"genre": genre, "LocalHl": LocalHl}).toArray(function (err, result) {
            if (typeof result !== "undefined" && result.length > 0) {
                let newArr = [uniqueID];
                let nowArr = result[0].games;
                console.log('Arr\n', newArr, nowArr)

                let tempArr = newArr.concat(nowArr)
                let lastArr = tempArr.filter((item, pos) => tempArr.indexOf(item) === pos)
                console.log('update\n', lastArr, uniqueID, genre, LocalHl)
                assocCollection.update({genre: genre}, {
                    $set: {
                        "games": lastArr,
                    }
                })
            } else {
                console.log('new\n', uniqueID, genre, LocalHl)

                let gameArray = [uniqueID];
                assocCollection.insertOne({
                    "genre": genre,
                    "LocalHl": LocalHl,
                    "games": gameArray
                });
            }
        });
    } catch (e) {
        console.log('MONGO_ERROR update assoc', e);
    }
}

async function getCollectionSettings() {
    await updateCollectionSettings();
    return Array.from(collectionsSettings).map((coll) => coll[1]);
}

async function updateCollectionSettings() {
    collectionsSettings.clear();
    collectionsConnections.clear();

    const allCollections = await dbo.listCollections().toArray();
    const collectionNames = allCollections
        .map((coll) => {
            return coll.name
        })
        .filter((name) => {
            const reg = /pg_as(?!os)/i;
            return reg.test(name)
        });

    for (const collection of collectionNames) {
        const collectionConnection = dbo.collection(collection);
        const docArr = await collectionConnection.find({}).limit(1).toArray();
        const document = docArr[0];
        const collectionIndexes = await collectionConnection.indexes();
        const collectionIndexedKeys = collectionIndexes.map(
            (indexObj) => {
                const key = Object.keys(indexObj.key)[0];
                let valueType;

                if (key === '_id') {
                    valueType = 'objectId';
                } else if (key === 'createdAt') {
                    valueType = 'date';
                } else {
                    valueType = document && document[key] ? typeof document[key] : 'string';
                }
                return {
                    key,
                    type: valueType
                };
            }
        );

        const settings = {
            collectionName: collection,
            keys: Object.keys(document || {}),
            indexedKeys: collectionIndexedKeys,
        };

        collectionsSettings.set(collection, settings);
        collectionsConnections.set(collection, collectionConnection);

        if (docArr.length) {
            collectionsSettings.set(collection, settings);
        }
    }
}

async function getListFromCollection(
    collectionName,
    limit = 10,
    skip = 0,
    collectionsUpdated = false
) {
    if (collectionName) {
        const collection = collectionsConnections.get(collectionName);

        if (collection) {
            const logs = await collection.find({}, {limit, skip, sort: {_id: -1}}).toArray();
            return logs;
        } else if (!collectionsUpdated) {
            await updateCollectionSettings();
            return getListFromCollection(collectionName, limit, skip, true);
        } else {
            return {
                success: false,
                message: `Такої колекції не існує "${collectionName}"`
            };
        }
    } else {
        return {
            success: false,
            message: 'Не вказане ім\'я колекції'
        };
    }
}

async function queryFromCollection(collectionName, key, queryParam, skip = 0) {
    try {
        await updateCollectionSettings();

        const collection = collectionsConnections.get(collectionName);

        if (collection) {
            const collectionSettings = collectionsSettings.get(collectionName);
            const keyIndexed = collectionSettings.indexedKeys.find(
                (keyObj) => keyObj.key === key
            );

            if (keyIndexed) {
                if (keyIndexed.type === 'date') {
                    if (queryParam.start && queryParam.end) {
                        queryParam.start = new Date(queryParam.start);
                        queryParam.end = new Date(queryParam.end);
                        const result = await collection.find({
                            [key]: {
                                '$gte': queryParam.start,
                                '$lte': queryParam.end
                            }
                        }, {
                            limit: 50
                            , skip, sort: {[key]: -1}
                        }).toArray();
                        return {
                            success: true,
                            logs: result
                        };
                    } else {
                        return {
                            success: false,
                            message: `Не вказаний проміжок дат для пошуку: {start: ${queryParam.start}, end: ${queryParam.end}}`
                        };
                    }
                } else if (keyIndexed.type === 'objectId') {
                    const result = await collection.find({_id: ObjectId(queryParam)}).toArray();
                    return {
                        success: true,
                        logs: result
                    };
                } else {
                    const result = await collection.find(
                        {[key]: queryParam},
                        {limit: 50, skip, sort: {_id: -1}}).toArray();
                    return {
                        success: true,
                        logs: result
                    };
                }
            } else {
                return {
                    success: false,
                    message: `Пошук за даним ключом неможливий - ${key}`
                }
            }
        } else {
            return {
                success: false,
                message: `Такої колекції з логами не існує "${collectionName}"`
            };
        }
    } catch (e) {
        console.log(e);
        return {
            success: false,
            messase: 'Виникла помилка під час пошуку логів',
            error: e.toString()
        }
    }
}

async function addSlashCountIdent(ident) {
    try {
        identCollection.find({"ident": ident}).toArray(function (err, result) {
            if (typeof result !== "undefined" && result.length > 0) {
                let current_enter_count = result[0].enter_count + 1;
                identCollection.updateOne({ident: ident}, {
                    $set: {
                        "enter_count": current_enter_count,
                    }
                })
            } else {
                identCollection.insertOne({
                    "ident": ident,
                    "enter_count": 1,
                });
            }
        });
    } catch (e) {
        console.log('MONGO_ERROR update assoc', e);
    }
}

async function checkIdent(ident) {
    try {
        identCollection.find({"ident": ident}).toArray(function (err, result) {
            return typeof result !== "undefined" && result.length > 0;
        });
    } catch (e) {
        console.log('MONGO_ERROR update assoc', e);
        return false
    }
}


module.exports.insertLog = insertLog;
module.exports.createRecord = createRecord;
module.exports.getRecordsByLocalHl = getRecordsByLocalHl;
module.exports.getRecordsArray = getRecordsArray;
module.exports.getRecordsByGenre = getRecordsByGenre;
module.exports.getRecordsByLocalGl = getRecordsByLocalGl;
module.exports.deleteRecord = deleteRecord;
module.exports.createIdAssociation = createIdAssociation;
module.exports.getMainByLocalHl = getMainByLocalHl;
module.exports.getCatalogByLocalHl = getCatalogByLocalHl;

module.exports.getCollectionSettings = getCollectionSettings;
module.exports.getListFromCollection = getListFromCollection;
module.exports.queryFromCollection = queryFromCollection;

module.exports.addSlashCountIdent = addSlashCountIdent;
module.exports.checkIdent = checkIdent;
