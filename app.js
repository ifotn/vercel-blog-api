const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const posts = require('./controllers/posts');

// create app
const app = express();
app.use(bodyParser.json());

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

// db conn
mongoose.connect(process.env.CONNECTION_STRING, {
}).then((res) => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Connection Failed');
});

// enable cors BEFORE including the controllers which need it
const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS'
}));

app.use('/api/v1/posts', posts);

// start server
app.listen(4000);
module.exports = app;