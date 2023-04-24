const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send("Missing URL");
  }
  const fileName = `${uuidv4()}.mp3`;
  const filePath = path.join(__dirname, fileName);
  const command = `yt-dlp -x --audio-format mp3 -o ${filePath} ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send("Error");
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    res.download(filePath, fileName, () => {
      fs.unlink(filePath, (err) => {
        if (err) console.error(err);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
