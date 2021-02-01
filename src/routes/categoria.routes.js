const express = require("express");

let { verificatoken,verificaAdmin_Role } = require("../middlewares/autenticacion");
const Categoria = require("../models/categoria");
const app = express();

// MOSTRAR TODAS LAS CATEGORÍAS
app.get("/categoria", async (req, res) => {
  await Categoria.find((err, cat) => {
    if (err) {
      res.json({ msg: "Error" });
    }
    if (cat[0] == null) {
      res.json({ msg: "No hay categorias" });
    } else {
      res.json(cat);
    }
  }).populate({path: "usuario",  select: "email name"});
});

// MOSTRAR UNA CATEGORIA POR ID
app.get("/categoria/:id", (req, res) => {
  Categoria.findById(req.params.id, (err, cat) => {
    if (err) {
      res.json({ msg: "Error" });
    }
    if (!cat) {
      res.json({ msg: "No hay categorias" });
    } else {
      res.json(cat);
    }
  });
});

// CREAR NUEVA CATEGORIA

app.post("/categoria", verificatoken, async (req, res) => {
  let newcategoria = new Categoria({
    descripcion: req.body.descripcion,
    usuario: req.usuario._id,
  });

  await newcategoria.save((err, nuevacat) => {
    if (err) {
      return res.status(500).json({ ok: false, err });
    }
    if (!nuevacat) {
      return res.status(400).json({ ok: false, err });
    }

    res.json({ nuevacat });
  });
});

// ACTUALIZAR UNA CATEGORIA
app.put("/categoria/:id",verificatoken, async (req, res) => {
  let id = req.params.id;
  await Categoria.findByIdAndUpdate(id, {descripcion:req.body.descripcion},
    { new: true, runValidators: true },
    (err, nuevacat) => {
      if (err) {
        return res.status(500).json({ ok: false, err });
      }
      if (!nuevacat) {
        return res.status(400).json({ ok: false, err });
      }

      res.json({ nuevacat });
    }
  );
});

// ELIMINAR UNA CATEGORIA
app.delete('/categoria/:id',[verificatoken,verificaAdmin_Role],(req,res)=>{
    let id= req.params.id;
    Categoria.findByIdAndRemove(id,async(err,catborrada)=>{
        if (err) {
            return res.status(500).json({ ok: false, err });
          }
          if (!catborrada) {
            res.json({msg:"El id no existe"});
          }
      
          res.json({ msg: "Categoria Borrada"});
    })
});


module.exports = app;
