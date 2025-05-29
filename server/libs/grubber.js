const request = require('request');
const cheerio = require("cheerio");
const utf8 = require('utf8');
const imageToBase64 = require('image-to-base64');

let locals = [{hl: 'en', gl: 'us'}, {hl: 'ua', gl: 'ua'}, {hl: 'ru', gl: 'ru'}];

let links = [];
let gameData = [{
    "localId": 1,
    "position": "1",
    "link": "https://play.google.com/store/apps/details?id=com.outfit7.mytalkingtom2&hl=en&gl=us",
    "name": "My Talking Tom 2",
    "company": "GameLoft SE",
    "rating": "4.5",
    "category": "Casual",
    "additional": {"one": "one", "two": "two"},
    "description": "awesome game",
    "image": ""
},
    {
        "localId": 1,
        "position": "2",
        "link": "https://play.google.com/store/apps/details?id=jp.ne.ibis.ibispaint.app&hl=en&gl=us",
        "name": "ibis Paint",
        "company": "ibis inc.",
        "rating": "4.5",
        "category": "Art & Design",
        "additional": {"one": "one", "two": "two"},
        "description": "awesome game"
    }
];

function get_gameInfo() {
    let options = {
        url: gameData[0].link,
        method: 'GET',
        'Content-Type': 'text/plain; charset=utf-8'
    };
    console.log(options);
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error during load page:', error);
            return
        }

        //convert image to base 64 and to base!
        /**let base64img = urlToBase64_encode('https://play-lh.googleusercontent.com/xOgV-lsJ0C3367TI_ECmWk0Xg27IYRM_srFNe-WC1fYUnzgLIm8Ysz3igpLRkT1M2tI=s180');
         console.log('base64img', urlToBase64_encode('https://play-lh.googleusercontent.com/xOgV-lsJ0C3367TI_ECmWk0Xg27IYRM_srFNe-WC1fYUnzgLIm8Ysz3igpLRkT1M2tI=s180'));*/

        let $ = cheerio.load(body);

        urlToBase64_encode($('div[class=xSyT2c]').html().split('"')[1], $('div[class=pf5lIe]').html().split('"')[1]);
    })
}

// function to encode data to base64 encoded string by url
function urlToBase64_encode(localURL, localRate) {
    imageToBase64(localURL) // Image URL
        .then(
            (response) => {
                let index = gameData.findIndex(obj => obj.localId == 1);
                Object.assign(gameData[index], {"rating": localRate, "image": response});
                console.log('Got a game info', gameData);
            }
        )
        .catch(
            (error) => {
                console.error(error)
            }
        )
}