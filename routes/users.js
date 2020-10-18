var express = require('express');
var router = express.Router();
const objectID = require('mongodb').ObjectID;

router.get('/', (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }

    const users = req.app.locals.users;
    const _id = ObjectID(req.session.passport.user);

    users.findOne({ _id }, (err, results) => {
        if(err) {
            throw err;
        }

        res.render('account', {...results});
    });

});

router.get('/:username', (req, res, next) => {
    const users = req.app.locals.users;
    const usernmae = req.app.locals.params.username;

    users.findOne({ username }, (err, results) => {
        if(err || !results) {
            res.render('public-profile', {message: {error: ['user not found']}});
        }

        res.render('public-profile', {...results, username});
    });
});

router.post('/', (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }

    const users = req.app.locals.users;
    const {names, github, facebook, twitter} = req.body;
    const _id = ObjectID(req.session.passport.user);

    users.updateOne({ _id }, { $set: { names, github, facebook, twitter }},
        (err) => {
        if(err) {
        throw err;
    }

    res.redirect('/users');
});
});
module.exports = router;