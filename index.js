const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ukurasa wa kujaribu kama API iko hewani
app.get('/', (req, res) => {
    res.send('✅ Makyama Media API inafanya kazi kwa kasi ya 5G! (Injini Mpya)');
});

// ==========================================
// 1. KUDOWNLOAD AUDIO (MP3)
// ==========================================
app.get('/download/audio/:id', async (req, res) => {
    const videoId = req.params.id;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        // Tunavuta jina la wimbo kwanza
        const info = await youtubedl(url, { dumpSingleJson: true, noWarnings: true });
        // Tunasafisha jina ili lisilete shida kwenye simu ya mtu
        const title = info.title.replace(/[^a-zA-Z0-9 \-]/g, "");

        // Tunaiambia browser kuwa hili ni faili la kudownload
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // Tunavuta mzigo mzima na kuushusha moja kwa moja
        const stream = youtubedl.exec(url, {
            format: 'bestaudio',
            output: '-' // Hii inamaanisha mzigo uende kwa mtumiaji (stdout)
        }, { stdio: ['ignore', 'pipe', 'ignore'] });

        stream.stdout.pipe(res);

    } catch (error) {
        console.error("Audio Error:", error.message);
        res.status(500).send("Imeshindwa kupata audio. Mtandao unaweza kuwa chini au YouTube wamezuia kwa muda.");
    }
});

// ==========================================
// 2. KUDOWNLOAD VIDEO (MP4)
// ==========================================
app.get('/download/video/:id', async (req, res) => {
    const videoId = req.params.id;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        const info = await youtubedl(url, { dumpSingleJson: true, noWarnings: true });
        const title = info.title.replace(/[^a-zA-Z0-9 \-]/g, "");

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        // Tunavuta video yenye picha na sauti
        const stream = youtubedl.exec(url, {
            format: 'best[ext=mp4]/best',
            output: '-'
        }, { stdio: ['ignore', 'pipe', 'ignore'] });

        stream.stdout.pipe(res);

    } catch (error) {
        console.error("Video Error:", error.message);
        res.status(500).send("Imeshindwa kupata video. Mtandao unaweza kuwa chini au YouTube wamezuia kwa muda.");
    }
});

// Tunawasha Server
app.listen(PORT, () => {
    console.log(`🚀 Makyama Server inawaka kwenye port ${PORT}`);
});
