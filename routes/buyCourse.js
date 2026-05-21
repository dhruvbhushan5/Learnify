const express = require("express");
const Purchase = require("../models/Purchase");
const { courses, findCourseBySlug } = require("../data/courses");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("buy-course", {
    title: "Buy a Course",
    courses,
  });
});

router.get("/:slug", (req, res) => {
  const course = findCourseBySlug(req.params.slug);

  if (!course) {
    return res.status(404).send("Course not found");
  }

  res.render("course-payment", {
    title: course.title,
    course,
    error: null,
  });
});

router.post("/:slug/payment", async (req, res) => {
  const course = findCourseBySlug(req.params.slug);

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

  try {
    const purchase = await Purchase.create({
      courseSlug: course.slug,
      courseTitle: course.title,
      amount: course.price,
      studentName,
      email,
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
