const async = require('async');
const express = require('express');
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const bcrypt = require('bcryptjs');

const Message = require('../models/message');

const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');


const User = require('../models/user');

//middleware function for setting LocalStrategy messages array to none
const setMessagesToNone = function (req, res, next) {
    req.session.messages = []
    next();
}

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

//We use passReqToCallback to get a req object into our callback so that we can
//edit the req.session.messages back to an empty array.
// otherwise: ["incorrect username", "incorrect username", etc.]

passport.use(
    new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            req.session.messages = [];
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    return done(null, err);
                }

                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Incorrect password"});
                }
            })
        });
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });

router.post(
    "/log-in", (req, res, next) => setMessagesToNone(req, res, next),
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/log-in",
      badRequestMessage: "Missing username or password",
      failureMessage: true
    })
  );

router.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

router.get('/', (req, res, next) => {
    async.parallel({
            posts(callback) {
                Message.where('title')
                .populate('author')
                .exec(callback);
            },

    }, (err, results) => {
        if (err) {
            return next(err);
        }
        res.render("homepage", {
            posts: results.posts,
            user: req.user
        });

    })
});

router.get('/log-out', (req, res) => {
    res.render("homepage", {message: "Logged out"});
});

//Creating a new user
router.get('/sign-up', userController.get_user_form);
router.post('/sign-up', userController.post_user_form);

//Logging in with an existing user
router.get('/log-in', userController.get_user_login);

//Creating a new message
router.get('/create-post', messageController.get_message_form);
router.post('/create-post', messageController.post_message_form);

//View a message and update a message
router.get('/post/:id', messageController.get_message_detail);
router.post('/post/:id', messageController.post_message_detail);

//View a message and delete a message
router.get('/post/:id/delete', messageController.get_delete_message);
router.post('/post/:id/delete', messageController.post_delete_message);


module.exports = router;