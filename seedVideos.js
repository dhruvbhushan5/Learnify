const mongoose = require('mongoose');
const Video = require('./models/Video'); 

require("dotenv").config();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learnifyDB";

mongoose.connect(mongoUri);


const seedVideos = async () => {
  await Video.deleteMany(); 

  const videos = [
    {
      title: 'Frontend Masterclass - Complete HTML Tutorial',
      videoUrl: 'https://www.youtube.com/embed/tcoThJlO56A',
      thumbnail: '/images/html-thumbnail.png'  
    },
   
  ];

  await Video.insertMany(videos);
  console.log('Video data inserted');
  mongoose.disconnect();
};

seedVideos();
