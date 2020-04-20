// const path = require('path');
// const express = require('express');
// const app = express();
// const publicPath = path.join(__dirname, '..', './covid-19/public');
// const port = process.env.PORT || 3000;

// app.use(express.static(publicPath));

// app.get('*', (req, res) => {
//    res.sendFile(path.join(publicPath, 'index.html'));
// });

// app.listen(port, () => {
//    console.log(`Server is up on port ${port}!`);
// });
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080, () => {
	console.log(`Server is up on port ${process.env.PORT || 8080}!`);
});