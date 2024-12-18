const express = require ("express"); 
const bcrypt = require("bcryptjs"); 
const {User} = require ("../models/UserModel.js"); 
const {generateJWT, validateAdminAuth} = require("../functions/jwtFunctions.js"); 
// const { getAllUsers } = require("../controllers/adminController.js");


const router = express.Router(); 

//Login route for user and admin 
router.post("/login", async (request, response) => {
    const {email, password} = request.body; 

    // validate input
    if (!email || !password) {
        return response.status(400).json({message: "Email and password are required"}); 

    }

    try {
        // find user by email 
        const user = await User.findOne({email}); 
        if (!user) {
            return response.status(404).json({message: "User not found."});
            
        }

        // compare passwords 
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            return response.status(401).json({message: "Invalid credentials."}); 

        }

        // generate JWT 
        const token = generateJWT(user.id, user.username, user.email, user.isAdmin); 

        // Return JWT and user info
        response.json ({
            jwt: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        response.status(500).json({message: "Server error. Please try again later."}); 
    }

    
}); 


module.exports = router; 