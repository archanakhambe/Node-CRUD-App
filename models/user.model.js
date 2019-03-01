const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        requiered: 'Full Name can\'t be empty'
    },

    email: {
        type: String,
        requiered: 'Email can\'t be empty',
        unique: true
    },
    profileimage:{
		type: String
	},

    password: {
        type: String,
        requiered: 'Password can\'t be empty',
        minlength : [4,'Password must be atleast 4 charachter long']
    },
    saltSecret: String
});

//Custom validation for email
userSchema.path('email').validate((val) => {

},'invalid email.');

//Events
userSchema.pre('save', function (next){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash('this.password', salt, (err, hash) => {
            console.log("Inside pre save");
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
      if (err) {
        return cb(err, false);
      }
      return cb(null, isMatch);
    });
  };
  

mongoose.model('User', userSchema);