const RunwayML = require("@runwayml/sdk");

const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_SECRET
});

async function generateClip(prompt, sceneNumber) {
    console.log(`🎬 Starting scene ${sceneNumber}...`);

    const task = runway.textToVideo.create({
        model: "gen4.5",
        promptText: prompt,
        ratio: "720:1280",
        duration: 10
    });

    const result = await task.waitForTaskOutput({
        timeout: 10 * 60 * 1000
    });

    if (!result.output || !result.output[0]) {
        throw new Error(`No video output for scene ${sceneNumber}`);
    }

    console.log(`✅ Scene ${sceneNumber} completed`);

    return result.output[0];
}

module.exports = {
    generateClip
};
