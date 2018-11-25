var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('../models/user');
    
//routes
//landing page
router.get('/', function(req, res){
    res.render('landing', { page: 'home' });
});

//about page
router.get('/about', function(req, res){
    res.render('about', { page: 'about' });
});

//registration page
router.get('/register', function(req, res) {
    res.render('register', { page: 'register' });
});

//handle register
router.post('/register', function(req, res) {
    //TODO: change default role
    var newUser = new User({username: req.body.username, email: req.body.email, role: "admin"});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'New profile successfully created: ' + user.username);
            res.redirect('/shop');
        });
    });
});

//login page
router.get('/login', function(req, res) {
    res.render('login', { page: 'login' });
});

//handle login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/shop',
    failureRedirect: '/login'
}), function(req, res){
    
});

//logout
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/shop');
});

//checks login status
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

//export
module.exports = router;