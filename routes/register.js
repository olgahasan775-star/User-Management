const express = require('express')
const User = require('../models/user')
const router = express.Router()

//Create new user
router.post ('/', async (req, res) => {
    const { userName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    

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
            if (err.keyValue.userName) {
                return res.status(400).json({ message: "Username already exists" });
            }
             if (err.keyValue.email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            
        }
        res.status(400).json({message : err.message}) // 400is the user gives bad data 
    }
})

module.exports = router;