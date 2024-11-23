const Post = require ("../models/PostModel.js");

// create a new post (only admin)
const createPost= async (request, response) => {
    const {title, content} = request.body; 
    const {userId, isAdmin} = request.user; 


    try {
        if (!isAdmin) {
            return response.status(403).json({message:"You are not authorized to create posts."}); 

        }

        const post = await Post.create({
            title, 
            content, 
            createdBy: userId
        }); 

        response.status(201).json({message: "News post created.", post}); 
    } catch (error) {
        response.status(500).json({message: "Failed to create post. ", error:error.message}); 
    }
}; 

//get all news posts 
const getAllPosts = async (request, response) => {
    try {
        const posts = await Post.find().populate("createdBy", "username email"); 
        response.json({posts}) ; 
    } catch (error) {
        response.status(500).json({message: "Failed to fetch news.", error:error.message}); 
    }
}; 

// update news (only admin)
const updatePost= async (request, response) => {
    const {title, content} = request.body; 
    const{userId, isAdmin} = request.user; 

    try {
        if(!isAdmin) {
            return response.status(403).json({message:"You are not allowed to udpate posts. "}); 

        }

        const post = await Post.findById(request.params.id) ; 

        if (!post) {
            return response.status(404).json({message:"Post not found."}); 
        }

        // update post fields
        if (title) post.title = title;
        if (content) post.content = content; 

        await post.save (); 
        response.json({message: "News post updated."}); 

    
    } catch (error) {
        response.status(500).json({message:"Failed to update post.", error: error.message}); 
    }

}; 

//delete a post (admin only)
const deletePost = async (request, response) => {
    const {userId, isAdmin} = request.user; 

    try {
        // fetch post by ID
        const post = await Post.findById(request.params.id); 

        // admin and post check 
        if(!isAdmin) {
            return response.status(403).json({message:"You are not authorized to delete posts."}); 
        }
        

        if (!post) {
            return response.status(404).json({message:"Post not found."});

        }

        await post.deleteOne(); 
        response.json({message:"Post deleted"}); 

    } catch (error) {
        response.status(500).json({message:"Failed to delete post", error:error.message}); 
    }
}; 

module.exports = {
    createPost, 
    getAllPosts, 
    updatePost, 
    deletePost
}; 