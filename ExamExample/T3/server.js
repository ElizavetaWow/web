const express = require('express');
const path = require('path');

const app = express()
const port = 3000;
const server = require('http').createServer(app)

app.use(
    express.urlencoded({
        extended: true
    }),
);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname) + '/public/index.html')
})

app.get('/style.css', function(req, res) {
    res.sendFile(path.resolve(__dirname) + '/public/style.css')
});

server.listen(port, function() {
    console.log(`Listening on port ${port}`)
});