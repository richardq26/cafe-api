//MODIFICANDO EL PUERTO

process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//VENCIMIENTO DEL TOKEN
process.env.CADUCIDAD_TOKEN='48h';

//SEED DE AUTENTICACION DEL TOKEN
process.env.SEED= process.env.SEED || 'seed-de-desarrollo';

//VARIABLES DEL .ENV
const { DB_HOST, DB_NAME } = process.env;
const mongo_url = `mongodb://${DB_HOST}/${DB_NAME}`;

//BASE DE DATOS

let urldb;
if (process.env.NODE_ENV == "dev") {
  urldb = mongo_url;
} else {
    
  urldb =
    "mongodb+srv://aicos:GCdMdnd1RdQsQKue@cluster0.czana.mongodb.net/cafe";
}

process.env.urldb= urldb;

//GOOGLE CLIENT id
process.env.CLIENT_ID = process.env.CLIENT_ID || '593562541486-37gjhl8o52umk7pv9295tepl74erghie.apps.googleusercontent.com';