const express = require('express');
const upload = require('./upload');
const uploadWOAuth = require('./uploadWOAuth');
require('dotenv').config();

const app = express();
const port = 8080;
const bodyparser = require('body-parser');
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({extended: true}));

console.log('started');

app.post('/', async (req, res) => {
	try {
		console.log('----uploading');
		await upload();
		// await uploadWOAuth();
		res.send('suceess');
	} catch (error) {
		res.send(error);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
