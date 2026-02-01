const express = require("express");
const fs = require("fs");
const path = require("path");
const User = require('../models/User'); // MongoDB User model
const Video = require('../models/Video');
const router = express.Router();
const usersFilePath = path.join(__dirname, "../users.json");
const bcrypt = require("bcrypt");

router.get('/playlist', async (req, res) => {
    try {
      const videos = await Video.find(); 
      console.log("Fetched videos from DB:", videos); // Check terminal output
      res.render('playlist', { videos }); 
    } catch (err) {
      console.error("Error fetching videos:", err);
      res.status(500).send('Error fetching videos');
    }
  });

  router.get('/playlist1', async (req, res) => {
    try {
        const videos = await Video.find(); // Correct usage
        res.render('playlist1', { videos });
    } catch (err) {
        console.error("Error fetching videos:", err);
        res.status(500).send("Server Error");
    }
});

// Function to load users from JSON file (if needed for some feature)
function loadUsers() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, "[]"); // Create an empty JSON file if it doesn't exist
    }
    return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
}

// Function to save users to JSON file (again, not necessary with MongoDB, but kept for backward compatibility)
function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}

// **Register User (using MongoDB)**
router.post("/register", async (req, res) => {
  const { email, password } = req.body;//req.body contains the form data because Express uses a body parser (express.json() or express.urlencoded() middleware).

  if (!email || !password) {
      return res.render("register", {
          message: "Email and password are required",
          type: "error"
      });
  }

  try {
      const existingUser = await User.findOne({ email });//Uses Mongoose (User.findOne) to query MongoDB.
      if (existingUser) {
          return res.render("register", {
              message: "User already exists. Try logging in.",
              type: "error"
          });
      }

      // Let the User model handle hashing via pre-save hook
      const newUser = new User({ email, password });
      await newUser.save();

      return res.render("login", {
          message: "User registered successfully. You can now log in.",
          type: "success"
      });
  } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).render("register", {
          message: "Server error",
          type: "error"
      });
  }
});

// **Login User (using MongoDB)**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.render("login", { message: "Email and password are required", type: "error" });
    }
  
    try {
      const user = await User.findOne({ email }); // Find user by username
      if (!user) {
        return res.render("login", { message: "Invalid Email or password", type: "error" });
      }
  
      // Compare entered password with hashed password
      const isMatch = await user.comparePassword(password); 
      if (!isMatch) {
        return res.render("login", { message: "Invalid Email or password", type: "error" });
      }
  
      return res.render("index", { email, message: "Login successful!" });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  });
  
// **Logout**
router.get("/logout", (req, res) => {
    res.clearCookie("loggedInUser");
    return res.render("login", { message: "Logged out successfully", type: "success" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", { message: "Email and password are required", type: "error" });
    }

    try {
        const user = await User.findOne({ email }); // Find the user by username
        if (!user) {
            return res.render("login", { message: "Invalid eEail or password", type: "error" });
        }

        const isMatch = await user.comparePassword(password); // Compare password with hashed password
        if (!isMatch) {
            return res.render("login", { message: "Invalid Email or password", type: "error" });
        }

        return res.render("index", { email, message: "Login successful!" });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});

module.exports = router;



