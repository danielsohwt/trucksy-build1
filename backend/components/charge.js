const stripe = require('stripe')('sk_test_KHQxfcD6UzYpsJP9H9ykZRIb00wsKXWSM9');

module.exports = async (req, res) => {
	try {
		// return 'payment reached charge function'

		const amount = req.body.amount;
		const idempotencyKey = req.body.idempotencyKey;
		const currency = 'sgd';
		const source = req.body.source;
		
		const charge = {amount, currency, source};
		return stripe.charges.create(charge)
		.then(charge => {
			res.json({
				success: true,
				charge
				})
			}
		);	
	} catch (err) {
		res.json(err);
	}
};
