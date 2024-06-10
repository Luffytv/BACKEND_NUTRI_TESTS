const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require('dotenv').config();

dotenv.config();

require("./db");

const surveyRoutes = require("./routes/survey");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Connected to database' });
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/survey", surveyRoutes);

app.get("/", (req, res) => {
  res.send("ola");
});

app.listen(PORT, () => {
  console.log(`Servidor está corriendo en el puerto ${PORT}`);
});

module.exports = app;