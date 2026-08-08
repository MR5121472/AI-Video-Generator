require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const videoRoutes = require("./routes/video");

const app = express();

app.use(cors());
app.use(express.json({
    limit: "10mb"
}));

const PORT = process.env.PORT || 3000;

// Home
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Video Generator Backend is running 🚀",
        version: "1.0.0"
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

// Video API
app.use("/api/video", videoRoutes);

// Generated videos
app.use(
    "/outputs",
    express.static(
        path.join(__dirname, "outputs")
    )
);

app.listen(PORT, () => {
    console.log(
        `🚀 AI Video Generator Backend running on port ${PORT}`
    );
});
