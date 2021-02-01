const express= require('express');
const app= express();

app.use(require("./users.routes.js"));
app.use(require("./login.routes.js"));
app.use(require("./categoria.routes.js"));
app.use(require("./producto.routes.js"));
app.use(require('./upload.routes.js'));
app.use(require("./imagenes.routes.js"));
module.exports= app;