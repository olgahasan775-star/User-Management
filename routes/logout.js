const express = require("express");
const router = express.Router();
const tokenBlacklist = require("../blacklist");
const auth = require("../middleware/authMiddleware");


router.post("/", auth, (req, res) => {
    const token = req.token;  
    


    tokenBlacklist.push(token);
   
    res.json({ message: "Logged out successfully" });
});


module.exports = router