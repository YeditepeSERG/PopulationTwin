const express = require('express');
const fs = require('fs');

const app = express();

express.static.mime.define({'application/javascript': ['']})
app.use(express.static('.'));
app.use(express.static('inputPopup'));
app.get('/', (request, response) => {

    fs.readFile('./index.html', 'utf8', (err,html) => {
        if (err){
            response.status(500).send(':(');
        }
        response.send(html);
    })

});

app.get('/about.html', (request, response) => {

    fs.readFile('./about.html', 'utf8', (err,html) => {
        if (err){
            response.status(500).send(':(');
        }
        response.send(html);
    })

});

app.listen(process.env.PORT || 3000, ()=> console.log('App avaliable on http://localhost:3000'))