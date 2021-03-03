const express = require('express');
const debug = require('debug')('app');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const runway = require('./runway/runway.js')
require('dotenv/config');

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());

// IMPORT ROUTES
const hexRoute = require('./routes/hex');
const machineRoute = require('./routes/machine');

app.use('/hex', hexRoute);
app.use('/machine', machineRoute);
app.use(express.static('public'));
app.use(bodyParser.json());
// HOME
app.get('/', (req, res) => {
  res.send('We got a home!');
  debug('We got a home!');
});
app.post('/runway', (req, res) => {
  console.log('req: ', req.body)
  text = runway.getText(req.body.data).then(data => {
    console.log('data')
  res.send(data)
  })
})

/* app.get('/runway.html', (req, res) => {
  res.send('We got a runway!');
  debug('We got a home!');
});
 */

try{
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('DB Connected!'));
} catch (err) {
  console.log(err);
}

console.log(mongoose.connection.readyState);

//SERVER MAIN LISTENEr
const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port} ...`));


