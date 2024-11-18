const mongoose = require("mongoose"); 
const bcrypt = require('bcryptjs'); 
SALT_WORK_FACTOR=10;

// user schema
const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:  [true,'Username is missing'],
        minLength: 3,
        unique:true,
        trim: true
    },

    email: {
        type: String,
        required:[true,'Email is missing'],
        unique:true,
        match: /.+\@.+\..+/
    },

    password: {
        type:String,
        required: true,
        minLength:5, 
        trim:true
    },

    isAdmin: {
        type:Boolean,
        required:true,
        default:false
    }

}); 


// middleware to hash passwords 
UserSchema.pre("save", function(next) {
    const user=this; 

    // hash password if it has been modified or new
    if (!user.isModified('password')) return next(); 

    //generate salt 
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt) {
        if (err) return next(err); 

        // hash the password using the new salt 
        bcrypt.hash(User.password,salt, function(err, hash) {
            if (err) return next(err); 

            //override the cleartext password with the hashed one
            User.password = hash; 

            if (User.isAdmin === undefined){
                User.isAdmin = false;
            }
            next(); 
        });
    });
}); 

// passsword verification 
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err,isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}



// model based on the schema
const User = mongoose.model("User", UserSchema); 

// export the model 
module.exports = {
    User
}