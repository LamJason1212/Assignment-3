var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    //if user is authenticated in the session, call the next() to call the next request handler
    //Passport adds this method to request object. A middleware is allowed to add properties to
    //request and response objects
    if (req.isAuthenticated())
        return next();
    //if the user is not authenicated then redirect him to the login page
    res.redirect('/');
}

module.exports = function(passport) {
/* GET login page. */
router.get('/', function(req, res) {
    //Display the Login page with any flash message, if any
        res.render('index', {message: req.flash('message')});
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true
}));

/* GET Registration Page */
router.get('/signup', function(req, res) {
    res.render('register', {message: req.flash('message')});
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
}));

/* Route for Facebook authentication and login different scopes while logging in. */
router.get('/fb', passport.authenticate('fb', {scope: 'email'}
));

/* Handle the callback after Facebook has authenticated the user. */
router.get('/fb', passport.authenticate('fb', {
    successRedirect: '/home',
    failureRedirect: '/'
})
);

/* Route for LinkedIn. */
router.get('/linkedin', passport.authenticate('linkedin', {scope: 'email'}
));

/* Hnadle the callback after LinkedIn has authenticated the user. */
router.get('/linkedin', passport.authenticate('linkedin', {
    successRedirect: '/home',
    failureRedirect: '/'
})
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Handle Logout */
router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});
return router;
}
