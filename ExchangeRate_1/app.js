const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const port = 3000;
const server = require('http').createServer(app);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/index.html')
})


app.get('/get/:val', (req, res) => {
  const url = "mongodb://localhost:5000";
  const clientMongo = new MongoClient(url)
  let val = req.params.val;
  clientMongo.connect(function (err, client) {
    if (err) console.log(err);
    const db = client.db('currencies');
    const collection = db.collection('info')
    let currentDate = new Date()
    currentDate = currentDate.toISOString().substring(0, 10)
    collection.find({ Date: { $regex: `^${currentDate}` } }).toArray(function (err, result) {
      if (err) console.log(err);
      client.close();
      if (result.length == 0) {
        console.log("Данные берём с сайта")

        let response = null;
        new Promise(async (resolve, reject) => {
          try {
            response = await axios('https://www.cbr-xml-daily.ru/daily_json.js')
          } catch (er) {
            response = null;
            //console.log(er);
            //reject(er);
          }
          if (response) {
            let json = response.data;
            const url = "mongodb://localhost:5000";
            const clientMongo = new MongoClient(url)
            clientMongo.connect(function (err, client) {
              if (err) console.log(err);
              const db = client.db('currencies');
              const collection = db.collection('info')
              collection.insertOne(json, function (err, result) {
                if (err) console.log(err);
                client.close()
              })
            })
            let value = json['Valute'][val]['Value']
            res.send({ 'value': value });
          }
        })
      }
      else {
        console.log("Данные берём из базы")
        let value = result[0]['Valute'][val]['Value']
        res.send({ 'value': value });
      }
    })
  })
})

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
})