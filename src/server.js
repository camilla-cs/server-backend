const express = require ("express"); 

const app = express(); 

// const app = express(); 

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

module.exports = {
    app
}