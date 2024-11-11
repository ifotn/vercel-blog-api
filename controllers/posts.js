const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/* GET: /api/posts */
router.get('/', async (req, res) => {
    /* callback syntax BEFORE mongoose 7 which is new
    Post.find((err, posts) => {
        if (err) {
            res.json(err).status(400);
        }
        res.json(posts).status(200);
    });*/
    // new syntax w/o callback for mongoose 7 (march 2022)
    try {
        const posts = await Post.find().sort({'date': -1});
        return res.json(posts).status(200);
    }
    catch (err) {
        return res.json(err).status(400);
    }
})

/* GET: /api/posts/5 */
router.get('/:id', async (req, res) => {
    //console.log('get 1 called')
    try {
        const post = await Post.findById(req.params.id) //({ _id: req.params.id });
        console.log(post);
        return res.json(post).status(200);
    }
    catch (err) {
        return res.json(err).status(404);
    }
})

router.post('/', async(req, res) => {
    try {
        const post = await Post.create(req.body);
        return res.json(post).status(201);
    }
    catch (err) {
        return res.json(err).status(400);
    }
})

router.delete('/:_id', async (req, res) => {
    try {
        // mongoose remove() deprecated in v7+
        const post = await Post.findByIdAndDelete(req.params._id);
        return res.json(post).status(204); // 204: No Content
    }
    catch (err) {
        return res.json(err).status(404);
    }
})

router.put('/:_id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params._id, req.body);
        return res.json(post).status(202); // Accepted
    }
    catch (err) {
        return res.json(err).status(404);
    }
})

module.exports = router;