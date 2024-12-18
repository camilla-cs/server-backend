const mongoose = require ("mongoose");
 

const animeSchema = new mongoose.Schema ({
    mal_id:{type: Number, required:true},
    title: {type:String, required:true}, 
    title_japanese: {type:String}, 
    type: {type:String}, 
    aired : {type:String}, 
    image_url: {type:String}, 
}); 

//schema
const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "List name is required. "]
    },

    animeTitles: [
        {
            type:[animeSchema], 
            required:true
        },
    ],
   
    isPublic: {
        type: Boolean,
        default: false
    },
    
    
    
},{
    strictPopulate: false
}

); 

const List = mongoose.model("List", ListSchema); 

module.exports = List; 

