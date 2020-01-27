// TODO: put in environment variable file instead
const accountSid = 'ACc20f5b4f839c8d297275067aabf16cb1';
const authToken = '96c96eabfa668ce8ff90c271cfc5dc19';

const client = require('twilio')(accountSid, authToken);

// TODO: format datetime to human-readable format
module.exports = {
    sendSMS: function (dateTimeOfPickup, pickUpAddress, dropOffAddress) {
        client.messages
            .create({
                body: `Your delivery from ${pickUpAddress} to ${dropOffAddress} at pickup ${dateTimeOfPickup} has been confirmed.`,
                from: '+12019926725',
                to: '+6597594818'
            })
            .then(message => console.log(message.sid));
    }
}
