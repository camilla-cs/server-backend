const express = require("express"); 
const app = express(); 

// server app configuration

app.get('/',(request, response) => {
    response.json({
        message: "Hello there!"
    }); 

}); 

app.post("/", (request, response) => {
    response.json({
        message: "POST request received!"
    });
});

// server app configuration is finished

//to export the app 
module.exports = {
    app
}