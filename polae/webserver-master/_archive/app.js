// Pluralsight Tutorial: 
//Building Web Applications with Node.js and Express 4.0 
//by Johnathan Mills 

//Combined with Node.js Tutorial
//Mosh Hamedani

//https://www.youtube.com/watch?v=vjf774RKrLc
// Dev Ed

const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");

const app = express();

app.use(morgan("tiny"));

//app.use(express.static(path.join(__dirname, '/public/')));
//app.use(express.static(path.join(__dirname, '/public/')));

//basic get method
app.get("/", (req, res) => {
  res.send("We got a request");
  debug("We got a request");
});



//SERVER MAIN LISTENER
const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${chalk.green(port)} ...`));
