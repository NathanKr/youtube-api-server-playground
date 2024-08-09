import express, { Request, Response } from "express";
import { PORT } from "./constants"; // Ensure PORT is defined in your constants
import {  uploadVideo } from "./engine";
import path from "path";
import { authorizationURL, oauth2Client } from "./google-utils";
import { getDataDirPath } from "./project-utils";


// Initialize Express app
const app = express();

// Route to start the OAuth process
app.get("/auth", (req: Request, res: Response) => {
  res.redirect(authorizationURL);
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
      const videoFullPath = path.resolve(getDataDirPath(), "video1.mp4");
      const thumbnailPath = path.resolve(getDataDirPath(),"thumbnail.jpg");

      if (tokens.access_token) {
        console.log('uploadVideo process starting, please wait ...');
        
        uploadVideo(tokens.access_token, videoFullPath,thumbnailPath);
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
  console.log(`Server is running on http://localhost:${PORT}/auth`);
});


