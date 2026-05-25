const express = require("express");
const Course = require("../models/Course");
const { requireRole } = require("../middlewares/auth");

const router = express.Router();

// Render course upload page (restricted to tutors)
router.get("/upload", requireRole("tutor"), (req, res) => {
  res.render("upload", {
    title: "Upload Course",
    error: null,
    success: null
  });
});

// Process course upload form submission
router.post("/upload-course", requireRole("tutor"), async (req, res) => {
  const {
    slug,
    title,
    shortName,
    price,
    level,
    description,
    videoTitle,
    videoUrl
  } = req.body;

  if (!slug || !title || !shortName || !price || !level || !description) {
    return res.status(400).render("upload", {
      title: "Upload Course",
      error: "Please fill out all course metadata fields.",
      success: null
    });
  }

  // Construct videos array from request body arrays
  const videos = [];
  if (Array.isArray(videoTitle)) {
    for (let i = 0; i < videoTitle.length; i++) {
      if (videoTitle[i] && videoUrl[i]) {
        videos.push({ title: videoTitle[i], videoUrl: videoUrl[i] });
      }
    }
  } else if (videoTitle && videoUrl) {
    videos.push({ title: videoTitle, videoUrl });
  }

  if (videos.length === 0) {
    return res.status(400).render("upload", {
      title: "Upload Course",
      error: "Please add at least one video to this course.",
      success: null
    });
  }

  try {
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).render("upload", {
        title: "Upload Course",
        error: `A course with slug '${slug}' already exists. Please choose a unique slug.`,
        success: null
      });
    }

    const newCourse = new Course({
      slug: slug.toLowerCase().trim(),
      title,
      shortName,
      tutorName: req.user.email.split('@')[0], // Use tutor's name based on email
      tutorImage: "/images/pic-2.jpg", // Default placeholder image
      thumbnail: "/images/thumb-1.png", // Default placeholder thumbnail
      price: parseFloat(price),
      level,
      duration: `${videos.length} videos`,
      description,
      videos
    });

    await newCourse.save();

    res.render("upload", {
      title: "Upload Course",
      error: null,
      success: "Course uploaded successfully! You can see it in the courses catalog now."
    });
  } catch (err) {
    console.error("Course upload error:", err);
    res.status(500).render("upload", {
      title: "Upload Course",
      error: "Server error occurred while saving course. Please try again.",
      success: null
    });
  }
});

module.exports = router;
