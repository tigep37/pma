var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('../models/user'),
    middleware  = require('../middleware');
    
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
    var newUser = new User({username: req.body.username, email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname, phone: req.body.phone});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'New profile successfully created: ' + user.username);
            res.redirect('/');
        });
    });
});

//show user profile
router.get('/user/:id', function(req, res) {
   User.findOne({ _id: req.params.id}, function(err, foundUser){
       if(err){
           req.flash('error', 'No user record found');
           res.redirect('/');
       }else{
           res.render('user/show', { user: foundUser, page: 'profile' });
       }
   }) 
});

//edit user profile page
router.get('/user/:id/edit', function(req, res) {
    User.findOne({ _id: req.params.id}, function(err, foundUser){
        if(err){
            req.flash('error', 'something went wrong, you probably should not go there');
            res.redirect('user/show', { user: req.user, page: 'profile'});
        }else{
            res.render('user/edit', { user: foundUser, page: 'profile' });
        }
    }) 
});

//process profile change
router.put('/user/:id', middleware.checkUserProfile, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'Profile successfully updated!')
            res.redirect('/user/' + req.params.id);
        }
    });
});


//login page
router.get('/login', function(req, res) {
    res.render('login', { page: 'login' });
});

//handle login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), function(req, res){
    
});

//logout
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/');
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