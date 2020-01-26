import express from 'express';
import cors from 'cors';

const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));

//cross origin start
var originsWhitelist = [
'http//localhost:8100'
];
var corsOptions = {
	origin: function(origin, callback){
		var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
		callback(null, isWhitelisted);
	},
	credentials:true
}
app.use(cors()); //app.use(cors(corsOptions)) is to be used to restrict access once we have a fixed host.
//cross origin end

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const stripe = require('stripe')('sk_test_KHQxfcD6UzYpsJP9H9ykZRIb00wsKXWSM9');

app.post("/charge", (req, res) => {
	try {
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
});
