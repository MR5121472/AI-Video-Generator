const express = require("express");
const fs = require("fs");
const path = require("path");

const { generateClip } = require("../services/runwayService");
const {
    downloadFile,
    mergeVideos
} = require("../services/videoMerger");

const router = express.Router();

const outputDir = path.join(__dirname, "..", "outputs");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {
        recursive: true
    });
}

router.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        const jobId =
            "video_" +
            Date.now();

        const jobDir = path.join(outputDir, jobId);

        fs.mkdirSync(jobDir, {
            recursive: true
        });

        console.log("🎬 60-second video generation started");
        console.log("📝 Prompt:", prompt);

        const commonStyle = `
Ultra-realistic cinematic video,
high detail, natural lighting,
smooth realistic camera movement,
consistent visual style,
same main character throughout all scenes,
same clothing, same appearance,
same environment,
professional cinematic quality.
`;

        const scenes = [
            `${commonStyle}
Scene 1 of a six-scene story.
${prompt}
Opening scene. Establish the location and introduce the main action.
10 seconds.`,

            `${commonStyle}
Scene 2 of the same story.
Continue directly from Scene 1.
${prompt}
The main character continues the action.
10 seconds.`,

            `${commonStyle}
Scene 3 of the same story.
Continue directly from the previous scene.
${prompt}
Increase the action and develop the story.
10 seconds.`,

            `${commonStyle}
Scene 4 of the same story.
Continue directly from Scene 3.
${prompt}
Show the main event happening clearly.
10 seconds.`,

            `${commonStyle}
Scene 5 of the same story.
Continue directly from Scene 4.
${prompt}
Build toward the conclusion.
10 seconds.`,

            `${commonStyle}
Scene 6, final scene.
Continue directly from Scene 5.
${prompt}
Create a satisfying cinematic ending.
10 seconds.`
        ];

        const videoFiles = [];

        // Generate one clip at a time.
        // This avoids sending six simultaneous requests.
        for (let i = 0; i < scenes.length; i++) {

            const sceneNumber = i + 1;

            console.log(
                `\n🎥 Generating ${sceneNumber}/6`
            );

            const videoUrl = await generateClip(
                scenes[i],
                sceneNumber
            );

            const clipPath = path.join(
                jobDir,
                `scene-${sceneNumber}.mp4`
            );

            console.log(
                `⬇️ Downloading scene ${sceneNumber}...`
            );

            await downloadFile(
                videoUrl,
                clipPath
            );

            videoFiles.push(clipPath);

            console.log(
                `💾 Scene ${sceneNumber} saved`
            );
        }

        const finalVideo = path.join(
            jobDir,
            "final-60-second-video.mp4"
        );

        console.log("\n🔗 Merging six clips...");

        await mergeVideos(
            videoFiles,
            finalVideo
        );

        console.log(
            "🎉 FINAL 60-SECOND VIDEO CREATED!"
        );

        res.json({
            success: true,
            jobId: jobId,
            duration: 60,
            message: "60-second video generated successfully",
            video: `/outputs/${jobId}/final-60-second-video.mp4`
        });

    } catch (error) {

        console.error("❌ Video generation error:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Video generation failed",
            error: error.message
        });
    }
});

module.exports = router;
