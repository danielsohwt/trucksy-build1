const stripe = require('stripe')('sk_test_KHQxfcD6UzYpsJP9H9ykZRIb00wsKXWSM9');

module.exports = async (req, res) => {
	try {
		// return 'payment reached charge function'

		const amount = req.body.amount;
		const currency = 'sgd';
		const source = req.body.source;
		const idempotencyKey = req.body.idempotencyKey;

		const dateTimeOfPickup = req.body.dateTimeOfPickup;
		const pickUpAddress = req.body.pickUpAddress;
		const dropOffAddress = req.body.dropOffAddress

		const charge = {amount, currency, source};
		return stripe.charges.create(charge)
			.then(charge => {
					res.json({
						success: true,
						dateTimeOfPickup: dateTimeOfPickup,
						pickUpAddress: pickUpAddress,
						dropOffAddress: dropOffAddress,
						charge
					});
					const sms = require('./send_sms')
					sms.sendSMS(dateTimeOfPickup, pickUpAddress, dropOffAddress)
				}
			);
	} catch (err) {
		res.json(err);
	}
};
