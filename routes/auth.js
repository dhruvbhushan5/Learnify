const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey12345!";

// **Register Student User**
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("register", {
      message: "Email and password are required",
      type: "error"
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        message: "User already exists. Try logging in.",
        type: "error"
      });
    }

    // Create user with default role 'student'
    const newUser = new User({ email, password, role: 'student' });
    await newUser.save();

    // Log the user in directly by generating token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.redirect("/home");
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).render("register", {
      message: "Server error during registration",
      type: "error"
    });
  }
});

// **Register Tutor/Teacher User**
router.post("/teacher_register", async (req, res) => {
  const { name, email, pass, c_pass } = req.body;

  if (!email || !pass || !c_pass) {
    return res.render("teacher_register", {
      message: "All fields are required",
      type: "error"
    });
  }

  if (pass !== c_pass) {
    return res.render("teacher_register", {
      message: "Passwords do not match",
      type: "error"
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("teacher_register", {
        message: "User with this email already exists",
        type: "error"
      });
    }

    // Create user with role 'tutor'
    const newUser = new User({ email, password: pass, role: 'tutor' });
    await newUser.save();

    // Log tutor in directly
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    req.user = newUser;
    res.locals.user = newUser;

    return res.render("teacher_register", {
      message: "Tutor registration submitted successfully. You can now upload courses.",
      type: "success"
    });
  } catch (err) {
    console.error("Tutor registration error:", err);
    return res.status(500).render("teacher_register", {
      message: "Server error during teacher registration",
      type: "error"
    });
  }
});

// **Login User**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { message: "Email and password are required", type: "error" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { message: "Invalid Email or password", type: "error" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", { message: "Invalid Email or password", type: "error" });
    }

    // Sign JWT and set HTTP-only cookie
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.redirect("/home");
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).render("login", { message: "Server error during login", type: "error" });
  }
});

// **Logout**
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

module.exports = router;
