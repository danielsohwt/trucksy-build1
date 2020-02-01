const { sendgridKey } = require('../config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgridKey);

module.exports = {
    sendEmail: function (email, orderId, dateTimeOfPickup, pickUpAddress, dropOffAddress) {
        const msg = {
            to: `${email}`,
            from: 'Rentalorry <masayoshi0ogawa@gmail.com>',
            subject: `Deliver Confirmation [Order: ${orderId}]`,
            text: `Your delivery from ${pickUpAddress} to ${dropOffAddress} at pickup ${dateTimeOfPickup} has been confirmed.`,
        };
        sgMail.send(msg)
    }
}


