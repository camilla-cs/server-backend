const mongoose = require("mongoose"); 


// schema
const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:  true,
        minLenght: 3,
        unique:true,
        trim: true
    },

    email: {
        type: String,
        required:true, 
        unique:true,
        match: /.+\@.+\..+/
    },

    password: {
        type:String,
        required: true
    },

    role: {
        type: String, 
        enum: {
            values:['user', 'admin'],
            default:'user'
        }
    },
    isAdmin:Boolean

}); 






// model based on the schema
const UserModel = mongoose.model("User", UserSchema); 

// export the model 
module.exports = {
    UserModel
}