const mongoose = require('mongoose');
const Schema = mongoose.Schema; // alias for mongoose Schema

// Post Schema - defines the structure of a post
let postSchema = new Schema
({
    title: String,
    content: String,
    author: String,
    date: Date
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;