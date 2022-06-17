const express = require('express');
const MongoClient = require("mongodb").MongoClient;
const { post } = require('request');
const app = express();
const port = 8085;
var server = require('http').createServer(app);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.static('public'));

app.get('/server', function(req, res) {
    res.sendFile('E:\\ДЗ\\web\\Практика Барабаш\\Задание 1\\index.html')
})


app.post('/server', function(req, res) {
    const url = "mongodb://localhost:3000/";
    const client = new MongoClient(url);


    let searchEmail = req.body.login;
    let clientInfoSearch = "";
    let status = "";

    client.connect(function(err, client) {
        const db = client.db('clients');
        const collection = db.collection('info');

        collection.findOne({ "login": searchEmail }, { _id: 0 }, function(err, result) {
            if (err) throw err;
            clientInfoSearch = JSON.stringify(result)
            console.log(clientInfoSearch != 'null');


            if (clientInfoSearch != 'null') {
                if (result.password == req.body.password) {
                    status = "success"
                } else {
                    status = "fail1"
                }

            } else {
                status = "fail"
            }
            console.log(status);
            client.close();


            if (status == "fail") {
                client.connect(function(err, client) {
                    const db = client.db('clients');
                    const collection = db.collection('info');
                    let clientInformation = req.body;
                    collection.insertOne(clientInformation, function(err_2, result_2) {
                        if (err_2) {
                            return console.log(err_2);
                        }
                        console.log(clientInformation);
                        client.close();
                    });
                });
            }
            if (status == "fail1") {
                status = "fail"
            }
            res.send(`<form>
                <label>Ответ от сервера:</label>
                <p></p>
                <p>${status}</p>
            </form>`)
        })
    });
})

server.listen(port, function() {
    console.log(`Listening on : ${port}`);
})