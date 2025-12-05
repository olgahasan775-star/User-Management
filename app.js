require("dotenv").config()
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const userSchema = require("./models/user")
const userRouter = require('./routes/users')
const singinRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require ('./routes/logout.js')

app.use(express.json())
app.use("/users", userRouter)
app.use("/register",singinRouter)
app.use("/login", loginRouter)
app.use("/logout", logoutRouter)




 mongoose.connect(process.env.DB_URL)
        .then(() =>{
            app.listen(port, () => {
                console.log(`http://localhost:${port}/`)  
                console.log("connection done")
                })
        })
        .catch((err) => {console.log(err) });


