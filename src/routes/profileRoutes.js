const express =require("express"); 
const { validateUserAuth, validateAdminAuth } = require("../functions/jwtFunctions");
const { getProfile, updateProfile, deleteProfile } = require("../controllers/userController");
const { getAllUsers, deleteUser } = require("../controllers/adminController");

const router = express.Router(); 

//user Routes
router.get("/me", validateUserAuth, getProfile); 

router.put ("/me", validateUserAuth, updateProfile); 

router.delete("/me", validateUserAuth, deleteProfile); 


module.exports = router;