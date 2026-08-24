const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());

// Route ya msingi kuangalia kama API ipo hewani
app.get('/', (req, res) => {
    res.send('Makyama API Inafanya Kazi 100% 🚀');
});

// Route ya kuchomoa link za YouTube
app.get('/api/download', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) {
        return res.status(400).json({ error: 'Tafadhali weka link ya YouTube' });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        
        // Tunachomoa format nzuri za Audio na Video
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        // Kwa video, tunachukua yenye sauti na picha kwa pamoja (mp4)
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });

        res.json({
            success: true,
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            audio_url: audioFormat ? audioFormat.url : null,
            video_url: videoFormat ? videoFormat.url : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Imeshindikana. Labda link si sahihi au YouTube wamezuia.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ipo hewani kwenye port ${PORT}`);
});
