require('dotenv').config()
require("./config/config.js");
//nos permite crear variables de entorno desde .env, esto no se sube al host

const app=require("./server");
const puerto= app.get("port");

require("./database");

app.listen(puerto, ()=> {
    console.log("Server listening on", puerto)
});
   