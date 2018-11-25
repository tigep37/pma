var express     = require('express'),
    router      = express.Router(),
    Blog  = require('../models/blog'),
    middleware  = require('../middleware');

//index
router.get('/', function(req, res){
    //get all blog posts
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render('blog/index', {blogs: blogs, currentUser: req.user, page: 'blog' });
        }
    });
});

//new
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('blog/new');
});

//create
router.post('/', middleware.isLoggedIn, function(req, res){
    //get data from from and add to blog array
    var name = req.body.name;
    var image = req.body.image;
    var blogPost = req.body.blogPost;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlogEntry = { name: name, image: image, body: blogPost, author: author };
    //create new blog post and save to db
    Blog.create(newBlogEntry, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to blog page
            res.redirect('/blog');
        }
    });
});

//show
router.get('/:id', function(req, res){
    //find campground with provided id
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render('blog/show', { blog: foundBlog });
        }
    });
});





module.exports = router;