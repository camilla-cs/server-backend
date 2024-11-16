const express = require ("express"); 

require("dotenv").config(); 

// const app = express(); 
const {app} = require("./server.js"); 
const { dbConnect } = require("./utils/database.js");

// import the router 
const {router} = require("./controllers/animeController.js"); 
//use the router
// localhost:8080/anime/
app.use("/anime", router); 


const PORT = process.env.PORT || 8080; 


app.listen(PORT,async () => {

    await dbConnect();

    console.log(`Server is listening on port ${PORT}`);
});