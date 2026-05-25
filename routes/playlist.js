const express = require('express');
const Course = require('../models/Course');
const Purchase = require('../models/Purchase');
const Comment = require('../models/Comment');
const { requireAuth } = require('../middlewares/auth');
const { findCourseBySlug } = require('../data/courses');

const router = express.Router();

// Require user authentication for playlist pages
router.use(requireAuth);

// GET /playlist/:courseSlug - Render course playlist with videos and comments
router.get('/:courseSlug', async (req, res) => {
  const { courseSlug } = req.params;

  try {
    const courseDocument = await Course.findOne({ slug: courseSlug });
    const fallbackCourse = findCourseBySlug(courseSlug);

    if (!courseDocument && !fallbackCourse) {
      return res.status(404).send('Course not found');
    }

    const course = courseDocument ? courseDocument.toObject() : fallbackCourse;
    if ((!course.videos || course.videos.length === 0) && fallbackCourse && fallbackCourse.videos) {
      course.videos = fallbackCourse.videos;
    }

    // Access Check: 
    // 1. If course is free (price = 0) or user is a tutor, grant access.
    // 2. Otherwise, check if user has purchased the course.
    if (course.price > 0 && req.user.role !== 'tutor') {
      const hasPurchased = await Purchase.findOne({
        email: req.user.email,
        courseSlug: course.slug,
        status: 'paid'
      });

      if (!hasPurchased) {
        // Redirect to detail page with buy button if not purchased
        return res.redirect(`/buy-course/${course.slug}`);
      }
    }

    // Fetch comments for this course
    const comments = await Comment.find({ courseSlug }).sort({ createdAt: -1 });

    res.render('playlist', {
      course,
      videos: course.videos || [],
      comments
    });
  } catch (err) {
    console.error('Error fetching playlist:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST /playlist/:courseSlug/comment - Post a new comment
router.post('/:courseSlug/comment', async (req, res) => {
  const { courseSlug } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).send('Comment content cannot be empty');
  }

  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Verify access before letting them comment
    if (course.price > 0 && req.user.role !== 'tutor') {
      const hasPurchased = await Purchase.findOne({
        email: req.user.email,
        courseSlug: course.slug,
        status: 'paid'
      });

      if (!hasPurchased) {
        return res.status(403).send('Forbidden: Purchase course first.');
      }
    }

    const newComment = new Comment({
      user: req.user._id,
      userEmail: req.user.email,
      courseSlug,
      content: content.trim()
    });

    await newComment.save();
    res.redirect(`/playlist/${courseSlug}`);
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).send('Error saving comment');
  }
});

// GET /playlist - redirect to buy-course catalog
router.get('/', (req, res) => {
  res.redirect('/courses');
});

module.exports = router;
