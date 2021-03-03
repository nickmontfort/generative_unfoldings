
const express = require('express');
const router = express.Router();
const debug = require('debug')('hex');
const Hex = require('../models/Hex');
const bodyParser = require('body-parser');

// MIDDLEWARE
express().use(bodyParser.json());

// SIMPLE GET
/* router.get('/', (req, res) => {
  res.send('We got a hex!');
}); */

// GET ALL POSTS
router.get('/', async (req, res) => {
  const hexes = await Hex.find();
  res.json(hexes);
});

// POST A NEW HEX
router.post('/', async (req, res) => {
  const hex = new Hex({
    index: req.body.index,
    name: req.body.name
  });
  res.json(hex);
  console.log(hex);
  console.log(hex.name);
  //WRITE TO DB
  hex.save(function (err, hex) {
    if (err) return console.error(err);
  });
});




module.exports = router;