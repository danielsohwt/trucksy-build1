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
