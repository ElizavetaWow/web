const express = require('express');
const path = require('path');
const { Db } = require('mongodb');
const { post } = require('request');
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = 4000;
var server = require('http').createServer(app);
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const url_currency = "https://www.cbr-xml-daily.ru/daily_json.js";

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.static('public'));

app.get('/exchange', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});


app.post('/exchange', (req, res) => {
    const url = "mongodb://localhost:3001/"
    const client = new MongoClient(url)
    client.connect(function (err, client) {
        const db = client.db('rates');
        const collection = db.collection('info');
        let currency = req.body.currency;
        cursor = collection.findOne({ 'currency': currency, 'date': new Date().toISOString().substr(0, 10) }, (err, item) => {
            if (err) {
                res.send('error');
                return console.log(err);
            }
            if (!item) {
                $.get(url_currency, function (resp) {
                    var data = JSON.parse(resp);
                    let rateInformation = {
                        'date': data['Timestamp'].substr(0, 10),
                        'currency': currency,
                        'value': data['Valute'][currency]['Value']
                    };
                    collection.insertOne(rateInformation, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }
                    })
                    res.send(rateInformation)
                })
                return
            }
            res.send(item)
        })
    })
});



server.listen(port, function () {
    console.log(`listening on ${port}`);
})