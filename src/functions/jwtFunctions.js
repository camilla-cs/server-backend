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
    let providedToken = request.headers.jwt; 
    console.log(providedToken); 

    if (!providedToken) {
        return response.status(403).json({
            message:"Sign in to view the content."
        });
    }

    try {
        const decodedData = decodeJWT(providedToken); 
        request.user = {
            userId : decodedData.userId,
            username:decodedData.username,
            isAdmin: decodedData.isAdmin
        }; 
        next(); 
    } catch (error) {
        response.status(403).json({message: "Invalid or expired token. "}); 
    }

}

//middleware for admin
async function validateAdminAuth (request, response, next) {
    let providedToken = request.headers.jwt;

    if (!providedToken) {
        return response.status(403).json({
            message:"Sign in to access the content."
        });
    }

    let decodedData = decodeJWT(providedToken); 

    if (decodedData.isAdmin) {
        next(); 
    } else {
        return response.status(403).json({
            message:"Access denied. Admin only."
        });
    }
}



module.exports = {
    generateJWT,
    decodeJWT,
    validateUserAuth,
    validateAdminAuth
    
}