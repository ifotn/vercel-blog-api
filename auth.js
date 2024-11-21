const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config()
const sessionSecret = process.env.SESSION_SECRET;

const isAuthenticated = (req, res, next) => {
    //console.log(`req.cookies: ${req.cookies}`);
    const token = req.cookies.authToken;
    //console.log(`token: ${token}`)
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_DOMAIN);
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept')

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, sessionSecret);
        console.log(`decoded: ${decoded}`);
        req.user = decoded;
        next();
        // console.log(`token: ${token}`)
        // jwt.verify(token, sessionSecret, (err, decoded) => {
        //     if (err) { return res.status(401).json({ msg: 'Unauthorized'}); }
        //     req.user = decoded;
        //     console.log(`decoded: ${decoded}`);
        //     next();
        // })
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({ msg: 'Unauthorized'});
    }
}

module.exports = isAuthenticated;