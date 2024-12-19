const express = require("express");
const { validateAdminAuth } = require("../functions/jwtFunctions");
const { getAllUsers, deleteUser } = require("../controllers/adminController");

const router = express.Router();

// Fetch all users (Admins only)
router.get("/", validateAdminAuth, getAllUsers);

// Delete a user by ID (Admins only)
router.delete("/:id", validateAdminAuth, deleteUser);

module.exports = router;