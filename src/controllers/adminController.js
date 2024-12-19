// const express = require ("express"); 
// const {User} = require ( "../models/UserModel.js"); 

// // fetch all users
// const getAllUsers = async (request, response) => {
//     try {
//         const users = await User.find().then((users) => {
//             return response.json(users); 
//         }); 
        
//     } catch (error) {
//         response.status (400).json({message:error.message}); 
//     }

// }; 

// // Delete user
// const deleteUser = async (request, response) => {
//     try {
//         await User.findByIdAndDelete ( request.params.id); 
//         response.json({message: "User deleted succefully."}); 

//     } catch (error) {
//         response.status (500).json ({message: error.message}); 
//     }
// }; 

// module.exports = {
//     getAllUsers,
//     deleteUser
// }; 

