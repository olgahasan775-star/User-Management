const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const JWT_SECRET = process.env.JWT_SECRET;


router.post("/", async (req, res) => {
    const { userName, password } = req.body;
 
    try {
        // Check if user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, userName: user.userName, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send token
        res.json({
            message: "Logged in successfully",
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
