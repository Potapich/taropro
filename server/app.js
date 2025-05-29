/**
 * Created by Mykhailo Pedash 29.05.2025
 * описи в auxiliary
 */
const express = require('express');
const config = require('./config')
const app = express();
const fs = require('fs');
const basicAuth = require('basic-auth')

app.use(express.static(__dirname + "/../public/"));

let server = require('http').createServer(app);

server.listen(config.http_express_port, function () {
    console.log('App listening on port ' + config.http_express_port + '!')
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

app.get('/', function (req, res, next) {
    res.sendFile('index.html', {root: __dirname + '/views/'});
});

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

//rout best admin
const adminer = require('./routes/adminer');

//rout api
const api = require('./routes/api');

//taro getter
app.use('/api', api);

//best admin
app.use('/api/adminer', adminer);

app.get('/api/present', function (req, res) {

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

// async function checkIdent(ident) {
//     await lib_db.checkIdent(ident);
// }
//
// async function addSlashCountIdent(ident) {
//     await lib_db.addSlashCountIdent(ident);
// }
