const mongoose = require("mongoose"); 

// schema
const PostSChema = new mongoose.Schema({
    title: {
        type:String,
        required:  true,
        minLength: 4,
        trim: true
    },

    content: String,
    date: {
        type:Date,
        default: Date.now
    },

}); 







// model based on the schema
const PostModel = mongoose.model("Post", PostSChema); 









// export the model 
module.exports = {
    PostModel
}