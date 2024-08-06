import express, { Request, Response } from "express";
import { google, Auth } from "googleapis";
import credentials from "../credentials.json"; // Ensure this file is correctly formatted and accessible
import { PORT } from "./constants"; // Ensure PORT is defined in your constants
import { uploadVideo } from "./engine";
import path from "path";

// Define the Credentials type (if not already defined)
interface Credentials {
  web: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

const creds: Credentials = credentials;

// Initialize Express app
const app = express();

// Set up OAuth2 client with your credentials
const oauth2Client = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  creds.web.redirect_uris[0] // Ensure this is the correct redirect URI
);

// Scopes required for the API
const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

// Generate the authorization URL
const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

// Route to start the OAuth process
app.get("/auth", (req: Request, res: Response) => {
  res.redirect(url);
});

// Route to handle OAuth2 callback. /oauth2callback is actually the above YOUR_REDIRECT_URI
app.get("/oauth2callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (code) {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Respond to the user
      res.send("Authentication successful! Access token is logged.");
      console.log("Access token:", tokens.access_token);

      // Call the function to upload the video
      const videoFullPath = path.resolve(".", "data", "video1.mp4");
      if (tokens.access_token) {
        await uploadVideo(tokens.access_token, videoFullPath);
        console.log(`upload ${videoFullPath} to YouTube`);
        
      }
    } catch (error) {
      res.send("Error during authentication");
      console.error("Error exchanging code for tokens:", error);
    }
  } else {
    res.send("Authorization code not found");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
