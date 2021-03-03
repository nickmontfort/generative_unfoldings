const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');


router.get('/', (req, res) => {
  res.send('We got a machine!');
});

/* const { HostedModel } = require('@runwayml/hosted-models');

const model = new HostedModel({
  url: "https://gpt-2-machine.hosted-models.runwayml.cloud/v1",
  token: "dy9dytwK9ZOdTUenwZ/xYg=="
});

router.get('/', async (req, res) => {
  const prompt = 'Hey text generation model, finish my sentence';
  model.query({ prompt }).then(res=> console.log(res));
  res.send(result);
});
 */

module.exports = router;