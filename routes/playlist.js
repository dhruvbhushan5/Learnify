const express = require('express');
const Video = require('../models/Video');
const router = express.Router();

// ✅ GET /playlist - to render playlist page with videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        console.log("Fetched videos:", videos);
        res.render('playlist', { videos });
    } catch (err) {
        console.error("Error fetching videos:", err);
        res.status(500).send("Internal Server Error");
    }
});

//  POST /playlist/add-video - to add a new video
router.post('/add-video', async (req, res) => {
    const { title, videoUrl, thumbnail } = req.body;

    if (!title || !videoUrl || !thumbnail) {
        return res.status(400).send('Title, video URL, and thumbnail are required');
    }

    try {
        const newVideo = new Video({ title, videoUrl, thumbnail });
        await newVideo.save();
        res.status(201).send('Video added successfully');
    } catch (err) {
        console.error('Error saving video:', err);
        res.status(500).send('Error saving video');
    }
});

module.exports = router;
