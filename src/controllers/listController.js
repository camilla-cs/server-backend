const List = require ("../models/ListModel.js"); 

// create a new list
const createList = async (request, response) => {
    const {name, animeTitles, isPublic} = request.body; 
    const {userId} = request.user; 

    try {
        const newList = await List.create({
            name, 
            animeTitles, 
            createdBy: userId,
            isPublic
        });

        response.status(201).json({message:"List created.", list:newList}); 
    } catch (error) {
        response.status(500).json({message: "Failed to create a list.", error:error.message}); 

    }
}; 

// get all lists 
const getLists = async (request, response) => {
    try {
        const lists = await List.find().populate("createdBy", "username email"); 
        response.json({lists}); 

    } catch (error) {
        response.status(500).json({ message: "Failed to get all lists.", error: error.message}); 
    }
}; 

// get specific list
const getListById = async (request , response) => {
    try {
        const list = await List.findById(request.params.id).populate ("createdBy", "username email"); 

        if(!list) {
            return response.status(404).json({message: "List not found."}); 

        }

        response.json({list}); 
    } catch (error) {
        response.status(500).json({mesesage:error.message}); 
    }
}; 

// update a list
const updateList = async (request, response) => {
    const {name, animeTitles, isPublic} = request.body; 

    try {
        const list = await List.findById(request.params.id) ; 
    
        if (!list) {
            return response.status(404).json({message: "List not found."}); 
        }

        // check if user owns the list or is an admin 
        const {userId, isAdmin} = request.user; 
        if (list.createdBy.toString() !== userId && !isAdmin) {
            return response.status(403).json ({ message: "You are not authorized to update this list."}); 


        }

        //update list fields
        if (name) list.name = name; 
        if (animeTitles) list.animeTitles= animeTitles; 
        if(isPublic !== undefined) list.isPublic = isPublic; 

        await list.save(); 

        response.json({message:"List updated." }); 

    
    } catch (error ) {
        response.status(500).json({message:"Failed to update list."}); 
    }
}; 

// delete a list
const deleteList = async (request, response) => {
    try {
        const list = await List.findById(request.params.id); 

        if (!list) { 
        
            return response.status(404).json({message:"List not found."}); 

        }

        //check if the user owns the list or is admin
        const {userId, isAdmin} = request.user; 
        if (list.createdBy.toString() !== userId && isAdmin) {
            return response.status(403).json({message:"You are not authorized to delete the list."}); 
        }

        await list.remove(); 
        response.json({message:"List deleted."}); 
    } catch (error) {
        response.status(500).json({message:"Failed to delete list."}); 
    }
}; 

module.exports = {
    createList,
    getLists, 
    getListById, 
    updateList, 
    deleteList
}; 