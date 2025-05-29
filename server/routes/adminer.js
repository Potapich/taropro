const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const sv_db = require('../libs/db_lib');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/getCollections', async function(req, res) {
    const settings = await sv_db.getCollectionSettings();
    res.send(settings);
});

router.get('/getListFromCollection/:collectionName', async function(req, res) {
    const limit = Number(req.query.limit) || undefined;
    const startFrom = Number(req.query.startFrom) || undefined;

    // setTimeout(async () => res.send(await lib_db.getLogsFromCollection(req.params.collectionName, limit, startFrom)), 5000);
    res.send(await sv_db.getListFromCollection(req.params.collectionName, limit, startFrom));
});

router.get('/query/:collectionName', async function (req, res) {
    try {
        const collectionName = req.params.collectionName || null;
        const key = req.query.key || null;
        let queryParam = req.query.queryParam || null;
        const skip = Number(req.query.skip) || null;

        if (collectionName && key && queryParam) {
            if (key === 'createdAt') {
                queryParam = JSON.parse(queryParam);
            }

            res.send(await sv_db.queryFromCollection(collectionName, key, queryParam, skip));
        } else {
            res.send({
                success: false,
                message: 'Не вказано необхідні параметри для пошуку - імені колекції, ключу та параметру для пошуку'
            });
        }
    } catch (e) {
        res.send({
            success: false,
            message: `Виникла помилка під час зчитування параметрів: ${e.message}`
        });
    }
});

module.exports = router;
