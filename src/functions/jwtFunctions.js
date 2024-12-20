const jwt = require("jsonwebtoken"); 
require("dotenv").config(); 

let jwtSecretKey = process.env.JWT_SECRET_KEY; 


function generateJWT(userId, username,email,isAdmin) {
    return jwt.sign({
        userId: userId,
        username: username,
        email: email,
        isAdmin: isAdmin
        },
        jwtSecretKey,
        {
        expiresIn:"10h"
        }
    );
    
}

function decodeJWT (tokenToDecode) {
        
    return jwt.verify(tokenToDecode, jwtSecretKey); 
}


// middleware for user
async function validateUserAuth (request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(401).json({
          message: "Unauthorized: No token provided",
        });
    }
    // Extract token
    const providedToken = authHeader.split(" ")[1]; 
    if (!providedToken) return response.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        const decodedData = decodeJWT(providedToken);
        console.log("Decoded token data:", decodedData);

        request.user = {
            userId: decodedData.userId,
            username: decodedData.username,
            isAdmin: decodedData.isAdmin,
        };
        next();
    } catch (error) {
        console.error("JWT validation error:", error.message);
        response.status(403).json({ message: "Invalid or expired token." });
    }
}

//middleware for admin
async function validateAdminAuth (request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(403).json({
            message: "Sign in to access the content.",
        });
    }

    const providedToken = authHeader.split(" ")[1];

    try {
        const decodedData = decodeJWT(providedToken);

        if (!decodedData.isAdmin) {
            return response.status(403).json({
                message: "Access denied. Admin only.",
            });
        }

        request.user = decodedData;
        next();
    } catch (error) {
        response.status(403).json({ message: "Invalid or expired token." });
    }
}



module.exports = {
    generateJWT,
    decodeJWT,
    validateUserAuth,
    validateAdminAuth
    
}