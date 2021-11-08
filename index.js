if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const app = express();

const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');

const userRouter = require('./routes/userRouter.js');
const searchRouter = require('./routes/searchRouter.js');
const mangaRouter = require('./routes/mangaRouter');
const notificationRouter = require('./routes/notificationRouter')
const CustomError = require('./utils/customError.js');
const catchAsync = require('./utils/catchAsync.js');

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const SESS_SECRET = process.env.SESS_SECRET || 'badsecret';
const store = new MongoStore({mongoUrl: DB_URL, secret: SESS_SECRET, touchAfter: 24 * 3600})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", (e));
})

const sessionOptions = {
    store: store,
    name: 'sess',
    secret: SESS_SECRET,
    resave: false, saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        
    }
};

app.set('trust proxy', 1)

app.use(session(sessionOptions));
app.use(flash());

app.use(helmet({contentSecurityPolicy: false}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(DB_URL).then((x)=> {console.log("connected to mongodb")});

app.use(mongoSanitize());

/* Global middleware */
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

/* Homepage */
app.get('/', (req, res) => {

    res.render('homepage/homepage.ejs');
})

app.use('/', userRouter);

/* Searchpages */
app.use('/search', searchRouter);

/* Show manga pages */
app.use('/manga', mangaRouter);

app.use('/notifications', notificationRouter);


/* Invalid url - 404 */
app.all('*', (req, res, next) => {
    throw new CustomError("Couldn't find this page", 404);
})


/* Error handler */
app.use((e, req, res, next) => {

    let error = { message: e.message || "Something went wrong", code: e.statuscode || 500 };

    res.render('errorpage/errorpage.ejs', { error });
})

app.listen(PORT, (req, res) => {
    console.log("Listening");
})