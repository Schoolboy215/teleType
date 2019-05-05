# Installation instructions

Make sure you have node and npm installed. Hopefully you're good at troubleshooting compatiblity problems, because the sqlite3 package is troublesome!

Set up a google app that you will use to authenticate users. At the time of writing, the developer dashboard is available at [https://console.cloud.google.com/home/dashboard](https://console.cloud.google.com/home/dashboard).
* In the dashboard for your app, go to the credentials tab. Make yourself a set of OAuth credentials. **Take note of the clientId and clientSecret. You'll need these for a later step!**.
* Set up the `Authorized Javascript origins` and `Authorized redirect URIs`. The redirect URI should look like this: `[Your domain]/login/callback`. It is important that that path is allowed, because it's the URL that the server will be listening at for the google authentication response.
* Still in your app dashboard, switch to the OAuth Consent Screen tab. Allow the following scopes
  * profile
  * email
  * openid

Make a copy of this repo at the place you want the server to run using `git clone https://github.com/Schoolboy215/teleType`

Go into that directory and run `npm install`. This is where you'll see errors come up if your version of node or npm ends up being a problem. Good luck!

Create a directory called "uploadedImages" inside your teleType directory. **Your server won't be able to process image messages without this**

Open the file at `config/index.js` and replace the placeholders with the actual clientId and clientSecret you got from your google app. Note that the "local" configuration uses localhost for the callback. This is what I did during development. If you ever want to switch over to the development config, open "teleType.js" and look for the line that loads the config. Replace "production" with "local"

That should be all you need to get the node server ready to run. As far as actually getting it hosted, that will depend on what web server you use. Just look for a guide on using (nginx, apache, etc.) with nodejs and you should get some good information.

Once again, good luck! If you're setting this up, there's really no other reason than to use with the accompanying raspberry-pi printer client, that repository is here [https://github.com/Schoolboy215/teletype-client](https://github.com/Schoolboy215/teletype-client)
