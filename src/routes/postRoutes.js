const express = require ("express"); 
const { validateUserAuth } = require("../functions/jwtFunctions");
const { getAllPosts, createPost, updatePost, deletePost } = require("../controllers/postController");

const router = express.Router(); 

// create a post (admin only)
router.post("/", validateUserAuth, createPost); 
// get posts (all users)
router.get("/", getAllPosts); 
//admin only: update post
router.put("/:id", validateUserAuth, updatePost); 
//admin only: delete post
router.delete("/:id", validateUserAuth, deletePost); 

module.exports = router; 