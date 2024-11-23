// Imports 
const express = require ("express"); 
const { User } = require("./models/UserModel.js");
const { generateJWT, validateUserAuth, validateAdminAuth } = require("./functions/jwtFunctions.js");
const authRoutes = require ( "./routes/auth.js"); 
const { getAllUsers } = require("./controllers/adminController.js");
const profileRoutes = require("./routes/profileRoutes.js"); 
const animeRoutes = require("./routes/animeRoutes.js"); 
const listRoutes = require ("./routes/listRoutes.js"); 

const app = express(); 

// middleware to post json data into the server
app.use(express.json()); 

// Root route
app.get("/", (request,response) => {
    response.json({
        message: "Welocome to the last project!"
    });
});

// Test POST route
app.post("/", (request, response) => {
    response.json({
        message:"POST request received!"
    });
});

// Sign up route for user and admin 
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
    let newJwt = generateJWT(newUser.id, newUser.username, newUser.email, newUser.isAdmin); 

    // return JWT
    return response.json({
        jwt: newJwt,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
            
        }
    });
});

// Authentication routes
app.use ("/auth", authRoutes); 


// Protected route requires user auth
app.get("/userDashboard", validateUserAuth, (request, response) => {
    response.json({
        message:"Welcome to the user dashboard!"
    });
}); 

// Admin dashboard route (only admin)
app.get("/adminDashboard", validateAdminAuth, (request,response) => {
    response.json({
        message:"Welcome back, Admin!"
    }); 
}); 


app.use("/profile", profileRoutes); 

app.get("/users", validateAdminAuth,getAllUsers); 


// localhost:8080/anime/
app.use("/anime", animeRoutes); 

//list routes
app.use("/lists", listRoutes); 


// export the app so other files can control when to start and end the server
module.exports = {
    app
}
