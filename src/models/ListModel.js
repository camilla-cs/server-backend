const mongoose = require ("mongoose"); 

//schema
const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "List name is required. "]
    },

    animeTitles: [
        {
            type:String, 
            required:true
        },
    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      
    },

    username: {
        type:String, 
        required:true

    },

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

