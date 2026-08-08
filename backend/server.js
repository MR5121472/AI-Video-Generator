require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Home
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Video Generator Backend is running 🚀"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online",
        service: "AI Video Generator"
    });
});

// Test video generation endpoint
app.post("/api/video/generate", (req, res) => {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Prompt is required"
        });
    }

    const jobId =
        "job_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 8);

    res.json({
        success: true,
        message: "Video generation job created",
        jobId: jobId,
        prompt: prompt,
        duration: 60,
        status: "queued"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AI Video Generator Backend running on port ${PORT}`);
});
