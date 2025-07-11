'use strict';


const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = [
 "https://meet-lac-one.vercel.app"
];


const oAuth2Client = new google.auth.OAuth2(
 CLIENT_ID,
 CLIENT_SECRET,
 redirect_uris[0]
);


module.exports.getAuthURL = async () => {
 /**
  *
  * Scopes array is passed to the `scope` option.
  *
  */
 const authUrl = oAuth2Client.generateAuthUrl({
   access_type: "offline",
   scope: SCOPES,
 });


 return {
   statusCode: 200,
   headers: {
    'Access-Control-Allow-Origin': '*', //'http://127.0.0.1:8080'
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other headers your app uses
    'Access-Control-Allow-Credentials': true, // If needed
  },
   body: JSON.stringify({
     authUrl,
   }),
 };
};

module.exports.getAccessToken = async (event) => {
  // Decode authorization code extracted from the URL query
  const code = decodeURIComponent(`${event.pathParameters.code}`);
 
 
  return new Promise((resolve, reject) => {
    /**
     *  Exchange authorization code for access token with a “callback” after the exchange,
     *  The callback in this case is an arrow function with the results as parameters: “error” and “response”
     */
 
 
    oAuth2Client.getToken(code, (error, response) => {
      if (error) {
        return reject(error);
      }
      return resolve(response);
    });
  })
    .then((results) => {
      // Respond with OAuth token
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', //'http://127.0.0.1:8080'
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other headers your app uses
          'Access-Control-Allow-Credentials': true, // If needed
        },
        body: JSON.stringify(results),
      };
    })
    .catch((error) => {
      // Handle error
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    });
 };

 module.exports.getCalendarEvents = async (event) => {
  const accessToken = decodeURIComponent(`${event.pathParameters.access_token}`);
  oAuth2Client.setCredentials({ access_token: accessToken });

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: CALENDAR_ID,
        auth: oAuth2Client,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  })
  .then((results) => {
    return ({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', //'http://127.0.0.1:8080/'
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other headers your app uses
        'Access-Control-Allow-Credentials': true, // If needed
      },
      body: JSON.stringify({ events: results.data.items }),
    });
  })
  .catch((error) => {
    return ({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', //'http://127.0.0.1:8080'
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other headers your app uses
        'Access-Control-Allow-Credentials': true, // If needed
      },
      body: JSON.stringify(error),

    });
    
    });
 }


//cmd http-server in the static -site-test directory
