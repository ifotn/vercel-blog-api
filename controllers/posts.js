const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const auth = require('../auth');

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_DOMAIN);
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept')

    if (!token) {
        return false;
    }

    try {
        // const decoded = jwt.verify(token, sessionSecret);
        // req.user = decoded;
        // next();
        console.log(`token: ${token}`)
        jwt.verify(token, sessionSecret, (err, decoded) => {
            if (err) { return false; }
            req.user = decoded;
            //console.log(`decoded: ${decoded}`);
            return true;
        })
    }
    catch (error) {
        console.log(error)
        return false;
    }
}

/* GET: /api/posts */
router.get('/', async (req, res) => {
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
    try {
        const post = await Post.findById(req.params.id) //({ _id: req.params.id });
        console.log(post);
        return res.json(post).status(200);
    }
    catch (err) {
        return res.json(err).status(404);
    }
})

router.post('/', auth, async(req, res) => {
    //if (!verifyToken) { return res.status(401).json({ msg: 'Unauthorized'}) };

    try {
        const post = await Post.create(req.body);
        return res.json(post).status(201);
    }
    catch (err) {
        return res.json(err).status(400);
    }
})

router.delete('/:_id', auth, async (req, res) => {
    try {
        // mongoose remove() deprecated in v7+
        const post = await Post.findByIdAndDelete(req.params._id);
        return res.json(post).status(204); // 204: No Content
    }
    catch (err) {
        return res.json(err).status(404);
    }
})

router.put('/:_id', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params._id, req.body);
        return res.json(post).status(202); // Accepted
    }
    catch (err) {
        return res.json(err).status(404);
    }
})

module.exports = router;