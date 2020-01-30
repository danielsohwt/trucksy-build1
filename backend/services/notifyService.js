const { firebaseConfig } = require('../config')
const firebase = require('firebase')

const sms = require('../components/send_sms')
const email = require('../components/send_email')

firebase.initializeApp(firebaseConfig)
const fs = firebase.firestore()

module.exports = {
    notifyUser: async function (userId, orderId, dateTimeOfPickup, pickUpAddress, dropOffAddress) {
        let user = getUser(userId).then(function (result) {
            return result
        })
        const result = await user;
        sms.sendSMS(result.hpNumber, dateTimeOfPickup, pickUpAddress, dropOffAddress)
        email.sendEmail(result.username, orderId, dateTimeOfPickup, pickUpAddress, dropOffAddress)
    }
}

function getUser (userId) {
    let user = fs.collection('users').doc(userId);
    return user.get()
        .then(doc => {
            return doc.data()
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
}

