const request = require('request');
const cheerio = require("cheerio");
const utf8 = require('utf8');
const imageToBase64 = require('image-to-base64');

function get_position() {
    let encodedString = utf8.encode(settings.key_words);
    let options = {
        url: settings.pg_url + encodeURI(settings.key_words),
        method: 'GET',
        'Content-Type': 'text/plain; charset=utf-8'
    };
    console.log(options);
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error during load page:', error);
            return
        }

        let $ = cheerio.load(body);

        $('.poRVub').each((index, value) => {
            let link = $(value).attr('href');
            links.push({"link": link})
        });
        console.log('Was get a links');
        get_gameInfo();
    })
}