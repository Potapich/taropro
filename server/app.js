/**
 * Created by Mykhailo Pedash 29.05.2025
 * описи в auxiliary
 */
const express = require('express');
const config = require('./config')
const app = express();
const fs = require('fs');
const lib_db = require('./libs/db_lib')
const crypto = require('crypto')
const basicAuth = require('basic-auth')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/../public/"));

let server = require('http').createServer(app);

server.listen(config.http_express_port, function () {
    console.log('App listening on port ' + config.http_express_port + '!')
});

// cron.schedule('*/1 * * * *', () => {
//     console.log('running a task every two minutes');
//     get_position()
// });

/**
 app use
 if no let uniqueID = crypto.createHash('md5').update(gameUrl + '&hl=' + localHl + '&gl=' + localGl).digest('hex')
 give hash and write to base
 if yes - do plus to base

 app.use - adminka
 for adminka - do pswd!!!
 **/

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    try {
        next();
    } catch (e) {
        res.status(401).json({message: 'No authorization'})
    }
});

app.all('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.end('ok');
    } else {
        //move on
        next();
    }
});


app.all('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.end('ok');
    } else {
        //move on
        next();
    }
});

app.get(
    ['/detailDelta*', '/simpleDelta*', '/detailSmart*',
        '/runtime*', '/polyfills*', '/styles*', '/main*', '/Exo2*', '/favicon*', '/assets*'],
    function (req, res, next) {
        if (req.url.length > 1) {
            let filePath = req.url;
            let getFileRequest = fs.existsSync(__dirname + '/front/best-games' + filePath);
            if (getFileRequest) {
                let requestFile = fs.readFileSync(__dirname + '/front/best-games' + filePath);
                res.write(requestFile);
                res.end();
            } else {
                res.status(400).json('error');
            }
        } else {
            next();
        }
    }
);

app.get('/admin', function (req, res, next) {
    let credentials = basicAuth(req)
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="APP Taro server, charset="UTF-8"')
        res.end('Access denied')
    } else {
        addSlashCountIdent('admin')
        res.sendFile('index.html', {root: __dirname + '/front/best-games/'});
    }
});

app.get('/healthcheck', function (req, res, next) {
    res.end('healthcheck')
});

//basic auth
function check(name, psdadm) {
    let valid = true

    valid = valid && (name === config.BATaro.name)
    valid = valid && (psdadm === config.BATaro.psdadm)
    console.log(valid, name, psdadm)
    return valid
}

//end basic auth

app.all(['/pg_as_best/giveaway*'], function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    try {
        if (req.query.ident && checkIdent(req.query.ident)) {
            addSlashCountIdent(req.query.ident)
            next();
        } else {
            let current_date = (new Date()).valueOf().toString()
            let random = Math.random().toString()
            let uniqueIdent = crypto.createHash('md5').update(current_date + random).digest('hex')
            addSlashCountIdent(uniqueIdent)
            res.status(200).json({'message': 'new ident', 'ident': uniqueIdent})
        }
    } catch (e) {
        res.status(401).json({message: 'No authorization'})
    }
});

// //rout best grabber
// const implementer = require('./routes/implementer');
//
// //rout best unload
// const giveoutter = require('./routes/giveoutter');

//rout best admin
const adminer = require('./routes/adminer');

// app.use('/pg_as_best/workout', implementer);
//
// //best getter
// app.use('/pg_as_best/giveaway', giveoutter);

//best admin
app.use('/pg_as_best/adminer', adminer);

app.get('/pgstat/present', function (req, res) {

    let pos_number = links.findIndex(x => x.link.includes('com.MCPEAppzLabz.hulk.games'))
    if (pos_number > -1) {
        res.status(200).json({
            current_position: pos_number + 1
        })
    } else {
        res.status(201).json({
            error: 'something went wrong...'
        })
    }
})

async function checkIdent(ident) {
    await lib_db.checkIdent(ident);
}

async function addSlashCountIdent(ident) {
    await lib_db.addSlashCountIdent(ident);
}
