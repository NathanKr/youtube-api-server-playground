export const PORT = 3000;

// Scopes required for the API
export const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload", // required for youtube.videos.insert and youtube.thumbnails.set
  "https://www.googleapis.com/auth/youtube" // required for youtube.playlistItems.insert
];
