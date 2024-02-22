require('dotenv').config();
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
// app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'hello world!' });
});

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
