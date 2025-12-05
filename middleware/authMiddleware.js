const jwt = require("jsonwebtoken");
const tokenBlacklist = require("../blacklist");

function auth(req, res, next) {
    const authHeader = req.headers["authorization"];
    
    const token = authHeader && authHeader.split(" ")[1]; 
    //console.log("token in middleware" , token)

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    req.token = token; 

    // Check if the token is black listed 
    
    if (tokenBlacklist.includes(token)) {
        return res.status(403).json({ message: "Token is logged out" });
    }
    

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = auth;
