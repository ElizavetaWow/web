const express = require("express");
const cheerio = require("cheerio");

const request = require("request");
const rp = require("request-promise");
const MongoClient = require("mongodb").MongoClient;

const body_parser = require("body-parser");

const port = 5000;
const app = express();
const server = require("http").createServer(app);
app.use(body_parser.json());

app.get('/', (req, resp) => {
    resp.sendFile("E:\\ДЗ\\web\\Практика Барабаш\\Задание 2\\index.html")
});

app.get('/style.css', function(req, res) {
    resp.sendFile("E:\\ДЗ\\web\\Практика Барабаш\\Задание 2\\style.css")
});

app.get('/get/:val', (req, resp) => {
    let oil = req.params.val;
    console.log(oil);

    const db_link = "mongodb://localhost:3001/";
    const client = new MongoClient(db_link);

    let data = "";
    let today = new Date().toISOString().slice(0, 10);

    client.connect(function(err, client) {
        const db = client.db('oil');
        const collection = db.collection('info');
        cursor = collection.findOne({ 'name': oil, 'date': today }, (err, result) => {
            if (err) {
                res.send('error');
                return console.log(err);
            }
            console.log(result)
            if (!result) {

                if (oil == "BRENT") {

                    const url = "https://broker.ru/quotes/brent";

                    rp(url)
                        .then(function(html) {
                            const $ = cheerio.load(html);
                            let data = [];

                            $('body > section > section > main > div.quotes-layout__wrapper.layout__wrapper > article > div.quotes-block.quotes-head > div.quotes-block__content.quotes-head__main > div.quotes-head__price > span.quotes-head__price-value').each((idx, elem) => {
                                const title = $(elem).text().trim();
                                console.log(title);
                                data.push(title);
                            });

                            $('body > section > section > main > div.quotes-layout__wrapper.layout__wrapper > article > div.quotes-block.quotes-head > div.quotes-block__content.quotes-head__main > div.quotes-head__price > span.quotes-head__price-change._down').each((idx, elem) => {
                                const title = $(elem).text();
                                console.log(title);
                                data.push(title);
                            });

                            console.log(data);
                            //console.log(json);
                            //resolve(json);
                            resp.send({ "price": data[0], "dynamics": data[1] });
                            client.connect(function(err, client) {
                                const db = client.db('oil');
                                const collection = db.collection("info");
                                console.log(oil, today);
                                let curr_info = JSON.parse(`{"name": "${oil}", "date": "${today}", "price": ${data[0].replace(',', '.').replace('$', '')}, "dynamics": ${data[1].replace(',', '.').replace('%', '')}}`);
                                collection.insertOne(curr_info, function(err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log(result);
                                    client.close();
                                });
                            });
                        })
                        .catch(function(err) {
                            console.log(err);
                        })

                } else if (oil == "WTI") {

                    const url = "https://broker.ru/quotes/lcroil";

                    rp(url)
                        .then(function(html) {
                            const $ = cheerio.load(html);
                            let data = [];

                            $('body > section > section > main > div.quotes-layout__wrapper.layout__wrapper > article > div.quotes-block.quotes-head > div.quotes-block__content.quotes-head__main > div.quotes-head__price > span.quotes-head__price-value').each((idx, elem) => {
                                const title = $(elem).text();
                                console.log(title);
                                data.push(title);
                            });

                            $('body > section > section > main > div.quotes-layout__wrapper.layout__wrapper > article > div.quotes-block.quotes-head > div.quotes-block__content.quotes-head__main > div.quotes-head__price > span.quotes-head__price-change._down').each((idx, elem) => {
                                const title = $(elem).text().trim();
                                console.log(title);
                                data.push(title);
                            });

                            console.log(data);
                            resp.send({ "price": data[0], "dynamics": data[1] });
                            client.connect(function(err, client) {
                                const db = client.db('oil');
                                const collection = db.collection("info");
                                let curr_info = JSON.parse(`{"name": "${oil}", "date": "${today}", "price": ${data[0].replace(',', '.').replace('$', '')}, "dynamics": ${data[1].replace(',', '.').replace('%', '')}}`);
                                collection.insertOne(curr_info, function(err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log(result);
                                    client.close();
                                });
                            });
                        })
                        .catch(function(err) {
                            console.log(err);
                        })

                }
            } else {
                resp.send({ "price": result.price, "dynamics": result.dynamics });
            }
        });
    });

});


server.listen(port, function() {
    console.log(`Listening on port ${port}`);
});