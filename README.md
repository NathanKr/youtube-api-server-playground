<h2>Motivation</h2>
Experiment with youtube api (server side only) to access and modify private youtube data 
<ul>
<li>upload video : title , description , tags , defaultAudioLanguage , defaultLanguage , privacyStatus , selfDeclaredMadeForKids</li>
<li>upload thumbnail</li>
<li>upload playlist</li>
</ul>

<h2>Setup </h2>
<h3>Google cloud console project</h3>
<ul>
<li>create a google clode console project</li>
<li>enable google api</li>
<li>Use OAuth2</li>
<li>Add scopes : https://www.googleapis.com/auth/youtube.upload </li>
</ul>
<h3>YouTube channel owner</h3>
verify your phone number is required to upload custom thumbnail (might be done by loading manually thumbnail to existing video)


<h2>Usage</h2>
<ol>
<li>npm run dev</li>
<li>wait for running message</li>
<li>open the browser and access http://localhost:3000/auth</li>
<li>sign in using nathan@nathankrasney.com</li>
<li>'Auto YouTube Video Upload wants additional access to your Google Account' appears</li>
<li>click continue</li>
<li>check the console for message, in case of success it might take few minutes for the video to appear in the authenticated account YouTube account (nathan@nathankrasney.com)</li>
</ol>

<h2>Design</h2>
<h3>Technologies</h3>
OAuth2 and googleapis

<h3>Endpoints</h3>
http://localhost:3000/auth is used for authentication and later if ok redirect to http://localhost:3000/oauth2callback . You define the callback endpoint in the Google cloud console project while /auth is by design

<h3>credentials.json</h3>
This is a file that you download from Google cloud console project . You can see there e.g. the callback under redirect_uris
