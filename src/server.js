// Imports 
const express = require ("express"); 
const { User } = require("./models/UserModel.js");
const { generateJWT, validateUserAuth, validateAdminAuth } = require("./functions/jwtFunctions.js");

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

app.post("/signup", async (request, response) => {
    // check for username and password exist in the request.body 
    let username = request.body.username; 
    let password = request.body.password; 
    let email = request.body.email;
    let isAdmin = request.body.isAdmin;
   

    // if they are invalid, throw error 
    if (!username ||!email || !password) {
        response.status(400).json({
            message: "Incorrect or missing credentials."
        }); 
    }

    // make a user in the database using the username and password
    let newUser = await User.create({
        username: username, 
        password:password,
        email:email,
        isAdmin:isAdmin
    
    }); 

    // make JWT 
    let newJwt = generateJWT(newUser.id, newUser.username, newUser.email); 

    // return JWT
    response.json({
        jwt:newJwt,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            
        }
    });
});

app.get("/protectedRoute", validateUserAuth, (request, response) => {
    response.json({
        message:"You can see the content because you are signed in."
    });
}); 

app.get("/adminDashboard", validateAdminAuth, (request,response) => {
    response.json({
        message:"Welcome back, Admin!"
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
