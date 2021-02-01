const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const app = express();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post("/login", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuariodb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuariodb) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contraseña incorrectos",
        },
      });
    }

    if (!bcryptjs.compareSync(body.password, usuariodb.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Contraseña incorrecta",
        },
      });
    }

    let token = jwt.sign(
      {
        usuario: usuariodb,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    ); //acá va cualquier nombre(secret)//60segsx60min

    res.json({
      ok: true,
      usuario: usuariodb,
      token,
    });
  });
});

//CONFIGURACIONES DE GOOGLE
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  console.log(payload.name);
  console.log(payload.email);
  console.log(payload.picture);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}
//verify().catch(console.error);

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token)
  .catch(e => {
    return res.status(403).json({
      ok: false,
      err: e
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuariodb) => {
    if (err) {
      return res.status(500).json({ ok: false, err });
    }

    if (usuariodb) {
      if (usuariodb.google == false) {
        return res.status(400).json({
          ok: false,
          err: { message: "Debe usar su atenticacion normal" }
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuariodb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuariodb,
          token,
        });
      }
    } else {
      //SI EL USUARIO NO EXISTE EN NUESTRA BD
      let usuario = new Usuario();
      usuario.name = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuariodb) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        };

        let token = jwt.sign(
          {
            usuario: usuariodb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuariodb,
          token,
        });
      });
    }
  });
  
});
module.exports = app;
