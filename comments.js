// Create web server
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const comments = require('./comments.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create web server
const server = http.createServer(app);

// Use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
app.get('/comments', (req, res) => {
    res.json(comments);
});

app.post('/comments', (req, res) => {
    const newComment = {
        id: uuidv4(),
        name: req.body.name,
        comment: req.body.comment
    }

    comments.push(newComment);
    fs.writeFile('./comments.json', JSON.stringify(comments), () => {
        res.json(comments);
    })
});

app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;

    const index = comments.findIndex(comment => comment.id === id);
    comments.splice(index, 1);

    fs.writeFile('./comments.json', JSON.stringify(comments), () => {
        res.json(comments);
    })
});

// Start server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});