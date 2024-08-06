import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import credentials from '../credentials.json'
import { PORT } from './constants';

const creds: Credentials = credentials;


// Initialize Express app
const app = express();

// Set up OAuth2 client with your credentials
const YOUR_CLIENT_ID = creds.web.client_id;
const YOUR_CLIENT_SECRET = creds.web.client_secret;
const YOUR_REDIRECT_URI = creds.web.redirect_uris[0]

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URI
);

// Scopes required for the API
const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
];

// Generate the authorization URL
const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

// Route to start the OAuth process
app.get('/auth', (req: Request, res: Response) => {
  res.redirect(url);
});

// Route to handle OAuth2 callback. /oauth2callback is actually the above YOUR_REDIRECT_URI
app.get('/oauth2callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (code) {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Respond to the user
      res.send('Authentication successful! Access token is logged.');
      console.log('Access token:', tokens.access_token);
      console.log('todo : call here uploadVideo');
      
    } catch (error) {
      res.send('Error during authentication');
      console.error('Error exchanging code for tokens:', error);
    }
  } else {
    res.send('Authorization code not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
