const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema ({

    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/i,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
        ]
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

});

// Hash password before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return; // only hash if changed
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



module.exports = mongoose.model('User', userSchema)
