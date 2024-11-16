const mongoose = require("mongoose"); 

// schema
const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:  true,
        unique:true,
        trim: true
    },

    email: {
        type: String,
        required:true, 
        unique:true
    },

    password: {
        type:String,
        required: true
    },

    role: [String]

}); 



// model based on the schema
const UserModel = mongoose.model("User", UserSchema); 



// export the model 
module.exports = {
    UserModel
}