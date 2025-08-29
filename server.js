// Load environment variables from a .env file
require('dotenv').config(); 

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Get the API key from the environment variable set in GitHub Secrets
const apiKey = process.env.GOOGLE_API_KEY;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve your static front-end files from the "public" directory
app.use(express.static('public'));

// Secure API endpoint for explaining jargon
app.post('/api/explain-jargon', async (req, res) => {
    if (!apiKey) {
        return res.status(500).json({ error: "API key is not configured." });
    }
    
    try {
        const fetch = (await import('node-fetch')).default;
        const { prompt } = req.body;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        });
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json(data);
        }
        if (data.candidates && data.candidates.length > 0) {
            res.json({ text: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "No response from AI." });
        }
    } catch (error) {
        console.error("Error calling Google API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint for checking reportability
app.post('/api/check-reportability', async (req, res) => {
    if (!apiKey) {
        return res.status(500).json({ error: "API key is not configured." });
    }
    
    try {
        const fetch = (await import('node-fetch')).default;
        const { prompt } = req.body;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        });
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json(data);
        }
        if (data.candidates && data.candidates.length > 0) {
            res.json({ text: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "No response from AI." });
        }
    } catch (error) {
        console.error("Error calling Google API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
