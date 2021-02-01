const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const _ = require("underscore");
const bcryptjs = require("bcryptjs");
const {verificatoken,verificaAdmin_Role}=require('../middlewares/autenticacion');


app.get("/usuario",verificatoken ,(req, res) => {
  return res.json({
    usuario: req.usuario,
    nombre:req.usuario.name,
    email: req.usuario.email
  })
  
  
  let desde = req.query.desde || 0; //viene una variable llamada "desde"
  desde = Number(desde);
  let limite = req.query.limite || 15;
  limite = Number(limite);
  Usuario.find({estado:true}, "name email")
    .skip(desde)
    .limit(limite)
    .exec((err, usuariosdb) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.count({}, (err, conteo) => {
        res.json({
          ok: true,
          Usuarios: usuariosdb,
          Numero_de_usuarios: conteo,
        });
      });
    });
});

app.post("/usuario",[verificatoken,verificaAdmin_Role], (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    name: body.nombre,
    email: body.email,
    password: bcryptjs.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuariodb) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // usuariodb.password=null;
    res.json({
      ok: true,
      usuario: usuariodb,
    });
  });
});

app.put("/usuario/:id",[verificatoken,verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuariodb) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuariodb,
      });
    }
  );
});

app.delete("/usuario/:id",[verificatoken,verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  let cambiaEstado = {
    estado: false,
  };
  //Usuario.findByIdAndRemove(id,(err, usuarioborrado)=>{
  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true },
    (err, usuarioborrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!usuarioborrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario no existe",
          },
        });
      }

      res.json({
        ok: true,
        Usuario_eliminado: usuarioborrado,
      });
    }
  );
});

module.exports = app;
