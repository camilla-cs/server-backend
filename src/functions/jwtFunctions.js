const jwt = require("jsonwebtoken"); 
require("dotenv").config(); 

let jwtSecretKey = process.env.JWT_SECRET_KEY; 


function generateJWT(userId, username,email, isAdmin) {
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


// middleware 
async function validateUserAuth (request, response, next) {
    let providedToken = request.headers.jwt; 
    console.log(providedToken); 

    if (!providedToken) {
        return response.status(403).json({
            message:"Sign in to view the content."
        });
    }

    let decodedData = decodeJWT(providedToken); 
    console.log(decodedData); 
    if (decodedData.userId){
        next(); 

    } else {
        return response.status(403).json({
            message:"Sign in to view the content."
        });
    }

}

module.exports = {
    generateJWT,
    decodeJWT,
    validateUserAuth
    
}