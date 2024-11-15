const express = require ("express"); 

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express(); 
dotenv.config(); 


const PORT = process.env.PORT || 3000; 

// Middleware to parse JSON data
app.use(express.json()); 

app.get('/',(request, response) => {
    response.send('Server is running'); 

}); 

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});