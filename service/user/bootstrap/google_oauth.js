const dotenv = require('dotenv'); // To use .env param
const { google } = require('googleapis');

dotenv.config();

exports.initGoogleOauth = () => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT,
          );

        return oauth2Client;
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}
