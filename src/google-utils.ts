import { google } from "googleapis";
import credentials from "../credentials.json"; // Ensure this file is correctly formatted and accessible
import { SCOPES } from "./constants";

// Define the Credentials type (if not already defined)
interface Credentials {
  web: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

const creds: Credentials = credentials;

// Set up OAuth2 client with your credentials
export const oauth2Client = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  creds.web.redirect_uris[0] // Ensure this is the correct redirect URI
);


// Generate the authorization URL
export const authorizationURL = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});
