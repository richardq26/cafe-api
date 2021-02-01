const { Router } = require("express");
const router = Router();
let Usuario = require("../models/usuario");
var { verificatoken } = require("../middlewares/autenticacion");

var Producto = require("../models/producto");

// OBTENER TODOS LOS PRODUCTOS
router.get("/productos", async (req, res) => {
  await Producto.find((err,prod)=>{
    if(err){
      return res.status(500).json({ ok: false, err });
    }
    if(prod[0]==null){
      res.json({msg: "No se encontraron productos"});
    }
    res.json(prod);
    
  }).populate("usuario categoria","name email descripcion");
});

// OBTENER UN PRODUCTO POR id
router.get("/productos/:id", async (req, res) => {
  await Producto.findById(req.params.id,(err,prod)=>{
    if(err){
      return res.status(500).json({ok: false, err});
    }
    if(!prod){
      res.json({msg: "No se encontró este producto"});
    }
    res.json(prod);
  }).populare("usuario categoria", "name email descripcion");
});

// CREAR UN PRODUCTO

router.post("/productos", verificatoken, async (req, res) => {
  let newproducto = new Producto({
    nombre: req.body.nombre,
    precioUni: req.body.precioUni,
    descripcion: req.body.descripcion,
    disponible: req.body.disponible,
    categoria: req.body.categoria,
    usuario: req.usuario._id,
  });

  await newproducto.save((err, nuevoprod) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({ ok: true, nuevoprod });
  });
});

// ACTUALIZAR UN PRODUCTO
router.put("/productos/:id", verificatoken, async (req, res) => {
  let id = req.params.id;
  await Producto.findById(id, async(err, productodb) => {
    if (err) {
      res.status(500).json({ ok: false, err });
    }
    if (!productodb) {
      return res
        .status(500)
        .json({ ok: false, err: { msg: "El id no existe" } });
    }
    productodb.nombre = req.body.nombre;
    productodb.precioUni = req.body.precioUni;
    productodb.categoria=req.body.categoria;
    productodb.disponible=req.body.disponible;
    productodb.descripcion= req.body.descripcion;

    await productodb.save((err,productoactualizado)=>{
        if(err){
            res.status(500).json({ ok: false, err });
        }
        res.send(productoactualizado);
    });
  });
});


// ELIMINAR UN PRODUCTO
router.delete("/productos/:id",verificatoken, async (req, res) => {
  await Producto.findById(req.params.id,(err,prod)=>{
    if(err){
      return res.status(500).json({ ok: false, err });
    }
    if(!prod){
      return res.status(400).json({ ok: false, err:{msg: "ID no existe"}});
    }
    prod.disponible= false;
    prod.save((err,prodborrado)=>{
      if(err){
        return res.status(500).json({ ok: false, err });
      }
      res.json({msg: "Producto eliminado"+prod})
    })
    
  })
});

// BUSCAR PRODUCTOS
router.get("/productos/buscar/:termino",verificatoken, async (req, res)=>{
  let regex= new RegExp(req.params.termino,'i');
  await Producto.find({nombre: regex},(err, prod)=>{
    if(err){
      return res.status(500).json({ok: false, err});
    }
    if(!prod){
      res.json({msg: "No se encontró el producto"});
    }
    res.json(prod);
  });
});
module.exports = router;
