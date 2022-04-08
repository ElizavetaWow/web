const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const server = require('http').createServer(app);

app.get('/', (req, res) => {
  res.sendFile('C:/Users/Lisa/Documents/Study/web/ExchangeRate_1/index.html')
})


app.get('/get/:val', (req, res) => {
  //обращаемся к бд и прооверяем, нет ли уже загруженных курсов
  let options = {
    method: 'get',
    uri:'https://www.cbr-xml-daily.ru/daily_json.js',
    json: true
  };
  //console.log(req.params.val)


  let val = req.params.val;
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
      let value = json['Valute'][val]['Value']
      //console.log(value);
      //resolve(json);
      res.send({'value':value});
    }
  })
})


server.listen(port, function () {
  console.log(`Listening on port ${port}`);
})