const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// controllers
const posts = require('./controllers/posts');
const users = require('./controllers/users');
// auth libs
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const passportJWT = require('passport-jwt');
const cookieParser = require('cookie-parser');

// swagger API docs
const swaggerUi = require('swagger-ui-express');
//const swaggerDoc = require('./docs/swagger.json');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// create app
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

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
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
}));

// passport config BEFORE routers
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

// link passport to User model
const User = require('./models/user');
passport.use(User.createStrategy());

// link User model w/passport session mgmt
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setup JWT Options
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

let jwtOptions = 
{
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET
}

// setup JWT Strategy
let strategy = new JWTStrategy(jwtOptions, function(jwt_payload, done)
{
    try 
    {
        const user = User.findById(jwt_payload.id);
        if (user) 
        {
            return done(null, user);
        }
        return done(null, false);
    } 
    catch (error) 
    {
        return done(error, false);
    }
});

passport.use(strategy);

app.use('/api/v1/posts', posts);
app.use('/api/v1/users', users);

// swagger gen
const options = {
    swaggerDefinition: {
        info: {
            title: 'Vercel Blog API',
            version: '1.0.0',
            description: 'In-Class Express API'
        }
    },
    apis: [path.join(__dirname, '/controllers/*.js')]
};

const swaggerSpecs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// start server
app.listen(4000);
module.exports = app;