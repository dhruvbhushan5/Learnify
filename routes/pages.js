const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { courses: fallbackCourses } = require("../data/courses");

// Render login page
router.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }
  res.render("login"); 
});

router.get("/login", (req, res) => {
  res.redirect("/");
});

// Render register page
router.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }
  res.render("register"); 
});

router.get("/home", async (req, res) => {
  try {
    const courses = await Course.find().limit(6);
    res.render("index", { courses: courses.length > 0 ? courses : fallbackCourses.slice(0, 6) });
  } catch (err) {
    console.error("Error loading home page courses:", err);
    res.render("index", { courses: fallbackCourses.slice(0, 6) });
  }
});

router.get("/about", (req, res) => {
  res.render("about"); 
});

router.get("/teachers", (req, res) => {
  res.render("teachers");
});

router.get("/teacher_register", (req, res) => {
  if (req.user && req.user.role === 'tutor') {
    return res.redirect("/tutor/upload");
  }
  res.render("teacher_register");
});

router.get("/contactus", (req, res) => {
  res.render("contactus");
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('courses', {
      title: 'Courses',
      logoImage: 'WhatsApp Image 2024-08-01 at 14.25.29_18772675.jpg',
      userImage: 'pic-1.jpg',
      userName: req.user ? req.user.email.split('@')[0] : 'Guest',
      userRole: req.user ? req.user.role : 'guest',
      heading: 'Our Courses',
      courses: courses.length > 0 ? courses : fallbackCourses
    });
  } catch (err) {
    console.error("Error loading courses:", err);
    res.render('courses', {
      title: 'Courses',
      logoImage: 'WhatsApp Image 2024-08-01 at 14.25.29_18772675.jpg',
      userImage: 'pic-1.jpg',
      userName: req.user ? req.user.email.split('@')[0] : 'Guest',
      userRole: req.user ? req.user.role : 'guest',
      heading: 'Our Courses',
      courses: fallbackCourses
    });
  }
});

module.exports = router;
