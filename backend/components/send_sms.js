const { twilioAccountSID, twilioAuthToken } = require('../config');

const client = require('twilio')(twilioAccountSID, twilioAuthToken);

// TODO: format datetime to human-readable format
module.exports = {
    sendSMS: function (hpNumber, dateTimeOfPickup, pickUpAddress, dropOffAddress) {
        client.messages
            .create({
                body: `Your delivery from ${pickUpAddress} to ${dropOffAddress} at pickup ${dateTimeOfPickup} has been confirmed.`,
                from: '+12019926725',
                to: `${hpNumber}`
            })
            .then(message => console.log(message.sid));
    }
}
