const express =require("express"); 
const { validateUserAuth } = require("../functions/jwtFunctions");
const { getProfile, updateProfile, deleteProfile } = require("../controllers/userController");

const router = express.Router(); 

router.get("/:id", validateUserAuth, getProfile); 

router.put ("/:id", validateUserAuth, updateProfile); 

router.delete("/:id", validateUserAuth, deleteProfile); 

module.exports = router;