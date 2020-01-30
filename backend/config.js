const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    stripeKey: process.env.STRIPE_KEY,
    sendgridKey: process.env.SENDGRID_API_KEY,
    twilioAccountSID: process.env.TWILIO_ACC_SID,
    twilioAuthToken: process.env.TWILIO_AUTHTOKEN,
    test: process.env.FIREBASE_API_KEY,
    firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE__DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_BUCKET,
        messagingSenderId: process.env.FIREBASE_SENDERID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREID
    },

};
