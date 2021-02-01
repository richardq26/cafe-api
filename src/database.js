const mongoose = require("mongoose");

const { DB_HOST, DB_NAME} = process.env;
const mongo_url = `mongodb://${DB_HOST}/${DB_NAME}`;


mongoose
  .connect(process.env.urldb, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((db) => console.log("Base de datos conectada"))
  .catch((err) => console.log(err));


