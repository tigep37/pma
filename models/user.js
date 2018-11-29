var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: String,
    email: {type: String, unique: true, required: true},
    //for password resets
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    intakeForm: {
        
    }
});

//adds in serialize and deserialize
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);