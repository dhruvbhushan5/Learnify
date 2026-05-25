const express = require("express");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

// Require user authentication for all course purchasing routes
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("buy-course", {
      title: "Buy a Course",
      courses,
    });
  } catch (err) {
    console.error("Error loading buy courses catalog:", err);
    res.status(500).send("Error loading courses");
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    // Check if user has already purchased this course
    const existingPurchase = await Purchase.findOne({
      email: req.user.email,
      courseSlug: course.slug,
      status: "paid"
    });

    if (existingPurchase) {
      // If already purchased, redirect to the course playlist directly
      return res.redirect(`/playlist/${course.slug}`);
    }

    res.render("course-payment", {
      title: course.title,
      course,
      error: null,
    });
  } catch (err) {
    console.error("Error loading course payment page:", err);
    res.status(500).send("Server Error");
  }
});

router.post("/:slug/payment", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    const { studentName, email, phone, paymentMethod } = req.body;

    if (!studentName || !email || !phone || !paymentMethod) {
      return res.status(400).render("course-payment", {
        title: course.title,
        course,
        error: "Please fill all payment details before buying the course.",
      });
    }

    const purchase = await Purchase.create({
      courseSlug: course.slug,
      courseTitle: course.title,
      amount: course.price,
      studentName,
      email: email.toLowerCase().trim(),
      phone,
      paymentMethod,
      status: "paid",
    });

    res.render("payment-success", {
      title: "Payment Successful",
      course,
      purchase,
    });
  } catch (err) {
    console.error("Payment save error:", err);
    res.status(500).render("course-payment", {
      title: course.title,
      course,
      error: "Payment could not be completed. Please try again.",
    });
  }
});

module.exports = router;
