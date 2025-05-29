const mongoConfig = require('../config/config_mongo');
const {MongoClient} = require('mongodb');

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
let dbo;
let spreadsCollection;
let cardsCollection;
let contentCollection;

const client = new MongoClient(urlDB, {useNewUrlParser: true});

(async function mongo_starter() {
    await client.connect();
    console.log("Connected successfully to db - ", urlDB);
    dbo = client.db();
    spreadsCollection = dbo.collection(mongoConfig.spreadsCollection);
    cardsCollection = dbo.collection(mongoConfig.cardsCollection);
    contentCollection = dbo.collection(mongoConfig.contentCollection);
    spreadsCollection.createIndex({'lang': 1});
    cardsCollection.createIndex({'lang': 1});
    contentCollection.createIndex({'lang': 1});
    spreadsCollection.createIndex({'id': 1});
    cardsCollection.createIndex({'id': 1});

    dbo.listCollections().toArray(function (err, collInfos) {
        console.log(collInfos);
    });

})();

async function getSpreads(lang, id) {
    try {
        const projectFields = { _id: 0};

        console.log('MONGO_GET_SPREADS', lang, id);
        return await spreadsCollection.find({'lang': lang, 'id': id}).project(projectFields).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getCards(lang, id) {
    try {
        const projectFields = { _id: 0};

        console.log('MONGO_GET_CARDS', lang, id);
        return await cardsCollection.find({'lang': lang, 'id': id}).project(projectFields).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getContent(lang) {
    try {
        const projectFields = { _id: 0};

        return await contentCollection.find({'lang': lang}).project(projectFields).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getSpreadsInfo(lang) {
    try {
        console.log('MONGO_GET_SPREADS_INFO', lang);
        const projectFields = { _id: 0, description: 1, theme: 1, id: 1 };
        return await spreadsCollection.find({'lang': lang}).project(projectFields).toArray();

    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getCardsInfo(lang) {
    try {
        console.log('MONGO_GET_CARDS_INFO', lang);
        const projectFields = { _id: 0, main_description: 1, title: 1 ,  id: 1};
        return await cardsCollection.find({'lang': lang}).project(projectFields).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

module.exports.getSpreads = getSpreads;
module.exports.getCards = getCards;
module.exports.getContent = getContent;
module.exports.getSpreadsInfo = getSpreadsInfo;
module.exports.getCardsInfo = getCardsInfo;
