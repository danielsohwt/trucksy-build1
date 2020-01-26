const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const components = require('./components/index')

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

/*
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


 */
app.use(cors()); //app.use(cors(corsOptions)) is to be used to restrict access once we have a fixed host.
//cross origin end


app.use(components)



app.listen(4000, () => console.log(`Express server running on port 4000`));

