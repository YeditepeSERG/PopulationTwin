const express = require('express');
const fs = require('fs');
const bodyparser = require('body-parser')

const app = express();

app.use(express.static('.'));
app.use(express.static('inputPopup'));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({limit: '10mb'}));

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

const dataChunks = [];
app.post('/save-chunk', (req, res) => {
    const isLastData = req.body.isLastData;
    const path = req.body.path;
    const data = req.body.data;
    const responseData = {
        message: "",
    };
    
    if (isLastData) {
        const completeData = dataChunks.join('');
        fs.writeFileSync(path, completeData);
        dataChunks.length = 0;
        responseData.message = "Data received and saved.";
    } else {
        dataChunks.push(data);
        responseData.message = "Chunk received.";
    }

    res.send(responseData);
});

app.listen(process.env.PORT || 8080, ()=> console.log('App avaliable on http://localhost:8080'))