const express = require ("express"); 
const { validateUserAuth } = require("../functions/jwtFunctions");
const { createList, getLists, getListById, updateList, deleteList, getUserLists } = require("../controllers/listController");




const router = express.Router(); 

// routes for lists
//get user's lists
router.get("/lists/user", validateUserAuth, getUserLists); 

//create new list
router.post ("/", validateUserAuth, createList); 

// //get all lists
// router.get("/lists/user",validateUserAuth , getLists); 

//get list by id
router.get("/:id", validateUserAuth, getListById); 

//update specific list
router.put("/:id", validateUserAuth, updateList); 

//delete a list
router.delete("/:id", validateUserAuth, deleteList); 

module.exports = router; 

