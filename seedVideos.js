const mongoose = require('mongoose');
const Course = require('./models/Course');
const Video = require('./models/Video');
const User = require('./models/User');
const { courses } = require('./data/courses');

require("dotenv").config();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learnifyDB";

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Course.deleteMany();
    await Video.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing courses, videos, and users.');

    // Seed Courses
    const seededCourses = await Course.insertMany(courses);
    console.log(`Seeded ${seededCourses.length} courses.`);

    // Extract videos from courses to seed the legacy Video collection
    const legacyVideos = [];
    courses.forEach(course => {
      course.videos.forEach(video => {
        legacyVideos.push({
          title: `${course.title} - ${video.title}`,
          videoUrl: video.videoUrl,
          thumbnail: course.thumbnail
        });
      });
    });
    const seededVideos = await Video.insertMany(legacyVideos);
    console.log(`Seeded ${seededVideos.length} videos to the legacy Video collection.`);

    // Create a tutor user
    const tutorUser = new User({
      email: 'tutor@learnify.com',
      password: 'password123',
      role: 'tutor'
    });
    await tutorUser.save();

    // Create a student user
    const studentUser = new User({
      email: 'student@learnify.com',
      password: 'password123',
      role: 'student'
    });
    await studentUser.save();

    console.log('Seeded default accounts:');
    console.log('  Tutor:   tutor@learnify.com / password123');
    console.log('  Student: student@learnify.com / password123');

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedDatabase();
