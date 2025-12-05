const express = require('express')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require("bcrypt");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Get all user
router.get('/', auth, admin , async(req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch {
        res.status(500).json({message : res.message}) // 500 means the error is related to server 
    }
})
// Get one user
router.get('/:userName',auth, getUser, (req, res) => {
    res.send(req.user)
})
//Create new user
router.post ('/', async (req, res) => {
    const { userName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    //console.log("BODY =", req.body);

    const user = new User ({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    })
    

    try{
        const newUser = await user.save()
        res.status(201).json(newUser) // 201 successfully creating an object 

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(400).json({message : err.message}) // 400is the user gives bad data 
    }
})
//Update one user
router.patch('/:userName', auth, getUser,  async (req, res) => {
    const updates = req.body;
  

    if (updates.userName != null) {
    
      // Check if new username already exists 
      const existingUser = await User.findOne({
        userName: updates.userName,
        _id: { $ne: req.user._id} 
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists"
        });
      }
    }

     if (updates.email != null) {
      // Email format regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/i;

      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({
          message: "Invalid email format"
        });
      }

      // Check if new email already exists in another user
      const emailExists = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user._id}
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }
    }
    
    if (updates.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(updates.password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number"
        });
    }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    try {

      const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
// Delete user
router.delete('/:userName', auth, getUser, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.json({message: "User deleted successfully"})
    } catch (err) {
        res.status(500).json({message : err.message})
    }
})

// middle ware or function to get a user name 
async function getUser(req, res, next)
{
    let user 
    try {
        user = await User.findOne({userName : req.params.userName})
        if (user == null) {
            return res.status(404).json({message : "Cannot find user"})
        }

    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    req.user = user
    next()
}

module.exports = router;