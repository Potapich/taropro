const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const sv_db = require('../libs/db_lib');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/getSpreads', async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        let locale = Intl.DateTimeFormat().resolvedOptions().locale;

        let records = await sv_db.getSpreads(locale.substring(0, 2) || "ru", req.query.id);
        res.send(records);
    } else {
        res.status(400).json('error, no id');
    }

});

router.get('/getCards', async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        let locale = Intl.DateTimeFormat().resolvedOptions().locale;

        let records = await sv_db.getCards(locale.substring(0, 2) || "ru", req.query.id);
        res.send(records);
    } else {
        res.status(400).json('error, no id');
    }
});

router.get('/getSpreadsInfo', async function (req, res) {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;

    let records = await sv_db.getSpreadsInfo(locale.substring(0, 2) || "ru");
    res.send(records);
});

router.get('/getCardsInfo', async function (req, res) {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;

    let records = await sv_db.getCardsInfo(locale.substring(0, 2) || "ru");
    res.send(records);
});

router.get('/getContent', async function (req, res) {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;

    let result = await sv_db.getContent(locale.substring(0, 2) || "ru");
    res.send(result);
});

module.exports = router;
