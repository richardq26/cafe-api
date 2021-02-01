require("./config/config.js");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
//settings
app.set("port", process.env.PORT || 3000);

//Middlewares
app.use(express.urlencoded({ extended: false }));

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,"public")));

//Routes
app.use(require("./routes/index.routes.js"));

module.exports = app;
