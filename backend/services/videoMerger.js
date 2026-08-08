const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

async function downloadFile(url, outputPath) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Video download failed: ${response.status} ${response.statusText}`
        );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    await fs.promises.writeFile(outputPath, buffer);
}

async function mergeVideos(videoFiles, outputFile) {
    const listFile = path.join(
        path.dirname(outputFile),
        "concat-list.txt"
    );

    const content = videoFiles
        .map(file => `file '${path.resolve(file)}'`)
        .join("\n");

    await fs.promises.writeFile(listFile, content);

    await execFileAsync("ffmpeg", [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        listFile,
        "-c",
        "copy",
        outputFile
    ]);

    return outputFile;
}

module.exports = {
    downloadFile,
    mergeVideos
};
