const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb');
const db = mongoose.connection;

// Check Connection
db.once('open', () => {
    console.log('connected to Mongo');
})
// check for db errors
db.on('error', (err) => {
    console.log(err);
});

// initialize app
const app = express();

// bring in The Models
const Article = require('./models/article');
// load engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) { 
            console.log(err);
        } else {
            res.render('index', {
                title: 'HELLO',
                articles: articles
            });
        }
    });
});
//adding route
app.get('/articles/add', (req, res) => {
    res.render('add_articles', {
        title: 'Add Articles'
    });
});

// ADD Submit POST Route
app.post('/articles/add', (req, res) => {

    const article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, () => {
    console.log('listening to port 3000');
});