const express = require('express');
const fs = require('fs');
const bodyparser = require('body-parser')

const app = express();

app.use(express.static('.'));
app.use(express.static('inputPopup'));

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

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

app.get('/login.html', (request, response) => {

    fs.readFile('./login.html', 'utf8', (err,html) => {
        if (err){
            response.status(500).send(':(');
        }
        response.send(html);
    })

});

app.get('/download', (request, response) => {

    const file = `${__dirname}/data/map3.geojson`;
    response.download(file);

});

app.post('/update-json', (request, response) => {
    const { newData, jsonFilePath } = request.body; 
    const jsonData = JSON.stringify(newData);

    fs.writeFile(jsonFilePath, jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } 
        else {
            console.log('Data written to file');
        }
    });
    
});

app.listen(process.env.PORT || 3000, ()=> console.log('App avaliable on http://localhost:3000'))