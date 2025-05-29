const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const sv_db = require('../libs/db_lib');

let advertising = false;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/getSpreads', async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        let records = await sv_db.getSpreads(req.query.lang || "ru", req.query.id);
        res.send(records);
    } else {
        res.status(400).json('error, no id');
    }

});

router.get('/getCards', async function (req, res) {
    if (typeof req.query.id !== 'undefined') {
        let records = await sv_db.getCards(req.query.lang || "ru", req.query.id);
        res.send(records);
    } else {
        res.status(400).json('error, no id');
    }
});

router.get('/getSpreadsInfo', async function (req, res) {
    let records = await sv_db.getSpreadsInfo(req.query.lang || "ru");
    res.send(records);
});

router.get('/getCardsInfo', async function (req, res) {
    let records = await sv_db.getCardsInfo(req.query.lang || "ru");
    res.send(records);
});

router.get('/getContent', async function (req, res) {
    let result = await sv_db.getContent(req.query.lang || "ru");
    res.send(result);
});

module.exports = router;
