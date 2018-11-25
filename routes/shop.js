var express     = require('express'),
    router      = express.Router(),
    Item        = require('../models/shop'),
    middleware  = require('../middleware');
    
//index page
router.get('/', function(req, res){
    //get all items
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        }else{
            res.render('shop/index', { items: items, currentUser: req.user, page: 'shop' });
        }
    });
});

//new item
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('shop/new', { page: 'shop' });
});

//create
router.post('/', middleware.isLoggedIn, function(req, res){
    //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newItem = {name: name, image: image, description: desc, author: author, price: price};
    //create new campground and save to db
    Item.create(newItem, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to campgrounds
            res.redirect('/shop');
        }
    });
});

//show
router.get('/:id', function(req, res){
    //find campground with provided id
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
        }else{
            res.render('shop/show', { item: foundItem, page: 'shop' });
        }
    });
});

//edit
router.get('/:id/edit', middleware.checkItemOwnership, function(req, res){
    Item.findById(req.params.id, function(err, foundItem) {
        if(err){
            res.redirect('back');
        }else{
            res.render('shop/edit', { item: foundItem, page: 'shop' });
        }
    });
});

//update
router.put('/:id', middleware.checkItemOwnership, function(req, res){
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/shop');
        }
    });
});

module.exports = router;