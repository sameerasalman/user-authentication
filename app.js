var express = require('express');
var path = require ('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const authUtils = require('./utils/auth');
const hbs = require('hbs');

var userRouter = require('./routes/user');
var taskRouter = require('./routes/task');
const authRouter = require('./routes/auth');

var app = express();

MongoClient.connect('mongodb://localhost', (err, client) => {
    if (err) {
        throw err;
    }

    const db = client.db('user-profiles');
    const users = db.collection('users');
    app.locals.users = users;
});

passport.use(new Strategy(
    (username, password, done) => {
        app.locals.users.findOne({ username }, (err, user) => {
            if(err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != authUtils.hashPassword(password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((user, done) => {
    done(null, { id });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partils'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

app.use('/', taskRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);