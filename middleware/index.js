var Item  = require('../models/shop');
var User  = require('../models/user');

var middlewareOjb = {};

//checks login status
middlewareOjb.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to log in to do that.');
    res.redirect('/login');
};

//checks ownership of shop item records
middlewareOjb.checkItemOwnership = function(req, res, next){
    if(req.isAuthenticated()){
         Item.findById(req.params.id, function(err, foundItem){
           if(err){
               req.flash('error', 'Item not found');
               res.redirect('back');
           }else{
               if(foundItem.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               }else{
                   req.flash('error', 'You do not have permission to do that.');
                   res.redirect('back');
               }
           }
        });       
    }else{
        req.flash('error', 'You need to log in to do that.');
        res.redirect('back');
    }
};

//checks ownership of user profile record
middlewareOjb.checkUserProfile = function(req, res, next){
    if(req.isAuthenticated()){
         User.findById(req.params.id, function(err, foundUser){
           if(err){
               req.flash('error', 'User not found');
               res.redirect('back');
           }else{
               if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                   next();
               }else{
                   req.flash('error', 'You do not have permission to do that.');
                   res.redirect('back');
               }
           }
        });       
    }else{
        req.flash('error', 'You need to log in to do that.');
        res.redirect('back');
    }
};

module.exports = middlewareOjb;