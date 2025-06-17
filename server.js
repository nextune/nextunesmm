const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const cors = require('cors'); // npm install cors
require('dotenv').config();

const app = express();
app.use(cors());

// Here we use a 3rd-party API (like rapidAPI) to resolve video URL
// Signup for a service and put API_HOST and API_KEY in .env

// Example (using a fake API):
// API_HOST = "your-rapidapi.example.com"
// API_KEY = "your_key"

app.get('/api/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL) {
        return res.status(400).json({error:'url is required'})
    }
    try {
        // 3rd-party API call
        const response = await fetch(`https://${process.env.API_HOST}/download?url=${encodeURIComponent(videoURL)}`, {
            headers: { "X-API-Key": process.env.API_KEY }
        });

        const data = await response.json();

        if (data?.download_url) {
            res.json({ download_url: data.download_url });
        } else {
            res.status(500).json({error:'Invalid API response'})
        }
    } catch (err) {
        res.status(500).json({error:'Server Error'})
    }
});

// Serve static files (your index.html) 
const path = require('path');
app.use(express.static(path.resolve(__dirname, '.')))

const port = 5000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
