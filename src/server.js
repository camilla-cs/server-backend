// Imports 
const express = require ("express"); 

const app = express(); 

// to post json data into the server
app.use(express.json()); 

app.get("/", (request,response) => {
    response.json({
        message: "Last project!"
    });
});

app.post("/", (request, response) => {
    response.json({
        message:"POST request received!"
    });
});



// import the router 
const animeController = require("./controllers/animeController.js"); 
//use the router
// localhost:8080/anime/
app.use("/anime", animeController); 


// export the app so other files can control when to start and end the server
module.exports = {
    app
}
