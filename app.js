var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    User            = require('./models/user'),
    flash           = require('connect-flash'),
    Blog            = require('./models/blog');
    
//requiring routes    
var shopRoutes = require('./routes/shop'),
    blogRoutes = require('./routes/blog'),
    indexRoutes = require('./routes/index');
    
//set database connection    
//mongoose.connect('mongodb://localhost/pma', { useNewUrlParser: true });//local
mongoose.connect('mongodb://tige:FatFrank37@ds163656.mlab.com:63656/pma', { useNewUrlParser: true });//mlab sandbox

//use body parser 
app.use(bodyParser.urlencoded({extended: true}));
//use ejs
app.set('view engine', 'ejs');
//set public directory for css/images
app.use(express.static(__dirname + '/public'));
//use override method for put/deletes
app.use(methodOverride('_method'));
//use flash for displaying error messages
app.use(flash());

//passport config
app.use(require('express-session')({
    secret: "Frank likes car rides",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//gets user state
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//use routes with prefixes
app.use(indexRoutes);
app.use('/shop', shopRoutes);
app.use('/blog', blogRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('PMA SERVER HAS STARTED');
});