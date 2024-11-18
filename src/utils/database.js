const mongoose = require("mongoose"); 
const { User } = require("../models/UserModel");



// connection to database
async function dbConnect(){
    console.log(process.env.DATABASE_URL); 
    let databaseUrl = process.env.DATABASE_URL ||  `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`; 
   
    await mongoose.connect(databaseUrl); 
}

module.exports = {
    dbConnect
}