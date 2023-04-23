const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

  res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
  res.header("Content-Type", "audio/mpeg");

  const videoReadableStream = ytdl(url, {
    format: "mp4",
    filter: "audioonly",
  });

  // Replace `python` with `python3` below
  const ffmpeg = exec("python3 - -y -i - -f mp3 -ab 128k -ac 2 -ar 44100 -vn -", (error) => {
    if (error) {
      console.error(`ffmpeg error: ${error}`);
    }
  });

  videoReadableStream.pipe(ffmpeg.stdin);
  ffmpeg.stdout.pipe(res);
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
