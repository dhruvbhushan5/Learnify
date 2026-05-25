const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  shortName: { type: String, required: true },
  tutorName: { type: String, required: true },
  tutorImage: { type: String, required: true },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },
  level: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  videos: [videoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
