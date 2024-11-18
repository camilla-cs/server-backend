const {User} = require("../models/UserModel"); 

// View user profile
const getProfile = async (request, response) => {
    try {
        const user = await User.findById(request.params.id); 
        if (!user) return response.status(404).json({message:"User not found"}); 

        response.json({
            id: user.id, 
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        response.status(500).json({message: error.message}); 
    }
}; 

//Update user profile
const updateProfile = async (request, response) => {
    const {username, email, password} = request.body; 
    console.log("Request body: " , request.body); 

    try {
        const user= await User.findById(request.params.id); 
        
        if (!user) return response.status(404).json({message: "User not found. "}); 

        // update only provided fieds
        if (username) user.username = username; 
        if(email) user.email = email; 

        //update password only if provided
        if (password) {
            user.password = password; 
        }
    
        // save updated user
        await user.save(); 
        response.json({
            message: "Profile updated.", 
            user: {
                id: user.id,
                username: user.username,
                email:user.email,
                isAdmin:user.isAdmin
            },
        
        
        }); 

    
    } catch (error) {
        console.error("Update profile error", error.message); 
        response.status(500).json({message: error.message}); 
    }
}; 


// Delete profile
const deleteProfile = async (request, response) => {
    try {
        const user = await User.findByIdAndDelete(request.params.id); 
        if (!user) return response.status(404).json({message:"User not found."}); 

        response.json({message:"User profile deleted."}); 
    } catch (error) {
        response.status(500).json({message:error.message}); 
    }
}; 

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile
}