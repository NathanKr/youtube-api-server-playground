import fs from "fs";
import { google } from "googleapis";
import { UploadVideoArgs } from "./types";

export async function uploadVideo(args: UploadVideoArgs) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: args.accessToken });

  const youtube = google.youtube({ version: "v3", auth });

  const videoResponse = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        ...args.videoSnippet,
        publishedAt: args.videoSnippet.publishedAt?.toISOString() ?? undefined,
      },
      status: args.videoStatus,
    },
    media: {
      body: fs.createReadStream(args.videoPath),
    },
  });

  console.log("Video uploaded", videoResponse.data);

  if (args.thumbnail) {
    const videoId = videoResponse.data.id;
    if (videoId) {
      await youtube.thumbnails.set({
        videoId,
        media: {
          body: fs.createReadStream(args.thumbnail.path),
        },
      });
      console.log("Thumbnail uploaded to video", videoResponse.data);
    }
  }

  if (args.playlistItem) {
    const playlistItemResponse = await youtube.playlistItems.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          playlistId: args.playlistItem.playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId: videoResponse.data.id,
          },
        },
      },
    });

    if (playlistItemResponse.data.snippet) {
      console.log(
        `Video added to playlist: ${playlistItemResponse.data.snippet.title}`
      );
    }
  }
}
