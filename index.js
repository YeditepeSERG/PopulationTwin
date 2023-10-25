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

app.get('/register.html', (request, response) => {

    fs.readFile('./register.html', 'utf8', (err,html) => {
        if (err){
            response.status(500).send(':(');
        }
        response.send(html);
    })

});

app.post('/update-json', (request, response) => {
    const { newData, jsonFilePath } = request.body; 
    const jsonData = JSON.stringify(newData);

    fs.writeFile(jsonFilePath, jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } 
    });
    
});

const dataChunks = [];
app.post('/save-chunk', (req, res) => {
    let isLastData = req.body.isLastData;
    let path = req.body.path;
    let data = req.body.data;
    dataChunks.push(data);

    if (isLastData) {
        const completeData = dataChunks.join('');
        fs.writeFileSync(path, completeData);
        dataChunks.length = 0;
        res.send('Data received and saved.');
    } else {
        res.send('Chunk received.');
    }
});

app.listen(process.env.PORT || 3000, ()=> console.log('App avaliable on http://localhost:3000'))