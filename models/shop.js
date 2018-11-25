var mongoose = require('mongoose');

//schema set up
var shopSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   }
});

module.exports = mongoose.model('Item', shopSchema);