import fs from "fs";
import { google } from "googleapis";

export async function uploadVideo(
  access_token: string,
  videoPath: string,
  thumbnailPath: string
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  const youtube = google.youtube({ version: "v3", auth });
  const today = new Date().toISOString(); // Get the current date in ISO 8601 format

  // Create upload session
  const videoResponse = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: "My Video",
        description: `Video description
                      0:00 Introduction
                      1:30 First Section
                      3:45 Second Section
                      5:00 Conclusion`,
        tags: ["tag1", "tag2"],
        publishedAt: today, // Set the creation date to today
        defaultLanguage: "en", // Set the video language (e.g., "en" for English)
      },
      status: {
        privacyStatus: "private", // or 'public', 'unlisted'
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });
  console.log("Video uploaded", videoResponse.data);

  // Upload the thumbnail
  const videoId = videoResponse.data.id;
  if (videoId) {
    await youtube.thumbnails.set({
      videoId,
      media: {
        body: fs.createReadStream(thumbnailPath),
      },
    });
    console.log('thumbnail uploaded to video', videoResponse.data);
  }

}
