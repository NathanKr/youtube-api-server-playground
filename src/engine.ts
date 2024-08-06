import axios, { AxiosProgressEvent } from "axios";
import fs from "fs";

// Video details
const videoDetails = {
  snippet: {
    title: "My Uploaded Video",
    description: "This is a test video uploaded via the YouTube API.",
    tags: ["test", "api", "youtube"],
    categoryId: "22", // Category ID for "People & Blogs"
  },
  status: {
    privacyStatus: "private", // Set to 'public' if you want it to be public
  },
};

// Function to create an upload session
async function createUploadSession(
  accessToken: string,
  videoFileSize: number
): Promise<string> {
  try {
    // Make a POST request to create the upload session
    const response = await axios.post(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable",
      videoDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Length": videoFileSize.toString(),
          "X-Upload-Content-Type": "video/*",
        },
      }
    );

    // Return the URL for the upload session
    return response.headers.location as string;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating upload session:", error.message);
    } else if (error instanceof Error) {
      console.error("Error creating upload session:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
    throw error;
  }
}

// Function to upload the video
export async function uploadVideo(accessToken: string, videoFullPath: string) {
  try {
    const videoFileSize = fs.statSync(videoFullPath).size;
    const uploadUrl = await createUploadSession(accessToken, videoFileSize);
    const videoStream = fs.createReadStream(videoFullPath);

    await axios.put(uploadUrl, videoStream, {
      headers: {
        "Content-Type": "video/*",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total ?? 0; // Default to 0 if undefined
        const loaded = progressEvent.loaded ?? 0; // Default to 0 if undefined
        const percentCompleted =
          total > 0 ? Math.round((loaded * 100) / total) : 0;
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    console.log("Video uploaded successfully");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error uploading video:", error.message);
    } else if (error instanceof Error) {
      console.error("Error uploading video:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
  }
}
