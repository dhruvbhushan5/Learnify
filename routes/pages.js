const express = require("express");
const router = express.Router();
const path = require("path");

// Render login page
router.get("/", (req, res) => {
    
    res.render("login"); 
});


router.get("/login", (req, res) => {
    res.redirect("/");
});


// Render register page
router.get("/register", (req, res) => {
    res.render("register"); 
});


router.get("/home", (req, res) => {
   
    res.render("index"); 
});

//  New: Render about page
router.get("/about", (req, res) => {
    res.render("about"); 
});


router.get("/playlist1", (req, res) => {
    
    res.render("playlist1");
});
router.get("/teachers", (req, res) => {
    
    res.render("teachers");
});
router.get("/teacher_register", (req, res) => {
    
    res.render("teacher_register");
});
router.get("/contactus", (req, res) => {
    
    res.render("contactus");
});
router.get('/courses', (req, res) => {
    const courses = [
      {
        tutorImage: 'pic-2.jpg',
        tutorName: 'Tapalagna Chakraborty',
        date: '21-10-2022',
        thumbnail: 'thumb-1.png',
        videosCount: 10,
        title: 'complete HTML tutorial',
        playlistLink: '/playlist'
      },
      {
        tutorImage: 'pic-2.jpg',
        tutorName: 'Jatin Arora',
        date: '26-12-2022',
        thumbnail: 'thumb-2.png',
        videosCount: 5,
        title: 'complete CSS tutorial',
        playlistLink: '/playlist2'
      },
      // Add other courses here...
    ];
  
    res.render('courses', {
      title: 'Courses',
      logoImage: 'WhatsApp Image 2024-08-01 at 14.25.29_18772675.jpg',
      userImage: 'pic-1.jpg',
      userName: 'Dhruv',
      userRole: 'student',
      heading: 'Our Courses',
      courses: courses
    });
  });
  




module.exports = router;
