const { stripeKey } = require('../config');
const stripe = require('stripe')(stripeKey);

const notifyService = require ('../services/notifyService')

module.exports = async (req, res) => {
	try {
		const amount = req.body.amount;
		const currency = 'sgd';
		const source = req.body.source;
		const idempotencyKey = req.body.idempotencyKey;

		const userId = req.body.userId;
		const orderId = req.body.orderId;
		const dateTimeOfPickup = req.body.dateTimeOfPickup
			.replace(/T/, ' ')      // replace T with a space
			.replace(/\..+/, ''); // delete the dot and everything after
		const pickUpAddress = req.body.pickUpAddress;
		const dropOffAddress = req.body.dropOffAddress

		const charge = {amount, currency, source};
		return stripe.charges.create(charge)
			.then(charge => {
					res.json({
						success: true,
						charge
					});
					notifyService.notifyUser(userId, orderId, dateTimeOfPickup, pickUpAddress, dropOffAddress)
				}
			);
	} catch (err) {
		res.json(err);
	}
};


// /* eslint-disable promise/always-return */
// // const functions = require('firebase-functions');
// const stripe = require('stripe')('sk_test_KHQxfcD6UzYpsJP9H9ykZRIb00wsKXWSM9');
//
// // exports.payWithStripe = functions.https.onRequest((request, response) => {
// module.exports = async (request, response) => {
// 	// Set your secret key: remember to change this to your live secret key in production
// 	// See your keys here: https://dashboard.stripe.com/account/apikeys
// 	console.log(request);
// 	// eslint-disable-next-line promise/catch-or-return
// 	stripe.charges.create({
// 		amount: request.body.amount,
// 		currency: request.body.currency,
// 		source: request.body.token,
// 	}).then((charge) => {
// 		// asynchronously called
// 		response.send(charge);
// 	})
// 		.catch(err =>{
// 			console.log(err);
// 		});
//
// };
