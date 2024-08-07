import fs from "fs";
import { google } from "googleapis";


export async function uploadVideoGemini(
  access_token: string,
  videoPath: string
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  const youtube = google.youtube({ version: "v3", auth });

  // Create upload session
  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: "My Video",
        description: "Video description",
        tags: ["tag1", "tag2"],
      },
      status: {
        privacyStatus: "private", // or 'public', 'unlisted'
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  console.log("Video uploaded:", res.data);
}

