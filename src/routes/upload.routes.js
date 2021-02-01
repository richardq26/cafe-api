const { Router } = require("express");
const fileUpload = require("express-fileupload");
const router = Router();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

// DEFAULT OPTIONS MIDDLEWARE
router.use( fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.put("/upload/:tipo/:id", async (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res
      .status(400)
      .json({
        ok: false,
        err: { msg: "No se ha seleccionado ningún archivo" },
      });
  }

  //Validar tipo
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res
      .status(400)
      .json({
        ok: false,
        err: { msg: "Los tipos validos son: " + tiposValidos.join(", ") },
      });
  }
  //Nombre que se le va a colocar cuando usemos el input=archivo
  let archivo = req.files.archivo;
  let nombre = archivo.name.split(".");
  let extension = nombre[nombre.length - 1];

  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  console.log("La extension es " + extension);
  if (extensionesValidas.indexOf(extension) < 0) {
    return res
      .status(400)
      .json({
        ok: false,
        err: {
          msg:
            "Las extensiones permitidas son: " + extensionesValidas.join(", "),
        },
      });
  }

  // Cambiar el nombre del Archivo

  let nuevonombre = `${id}-${new Date().getMilliseconds()}.${extension}`;
  // Código por defecto, mv de move
  archivo.mv(`uploads/${tipo}/${nuevonombre}`, (err) => {
    if (err) {
      return res.status(500).json({ ok: false, err });
    }
    if (tipo == "productos") {
      imagenProducto(id, res, nuevonombre);
    }
    if (tipo == "usuarios") {
      imagenUsuario(id, res, nuevonombre);
    }
    // Hasta aquí la imagen ha sido cargada
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuariodb) => {
    if (err) {
      // Igual la imagen se subió en la función archivo.mv
      // entonces borramos la imagen
      borraArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({ ok: false, err });
    }

    if (!usuariodb) {
      // Si el usuario no existe borramos la imagen que se subió
      borraArchivo(nombreArchivo, "usuarios");
      return res
        .status(400)
        .json({ ok: false, err: { msg: "Usuario no existe." } });
    }

    borraArchivo(usuariodb.img, "usuarios");
    usuariodb.img = nombreArchivo;
    usuariodb.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        img: nombreArchivo,
        usuarioGuardado,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productodb) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos");
      return res.status(500).json({ ok: false, err });
    }

    if (!productodb) {
      borraArchivo(nombreArchivo, "productos");
      return res
        .status(400)
        .json({ ok: false, err: { msg: "Producto no existe" } });
    }

    borraArchivo(productodb.img, "productos");
    productodb.img = nombreArchivo;

    productodb.save((err, productoGuardado) => {
      res.json({ ok: true, img: nombreArchivo, productoGuardado });
    });
  });
}

function borraArchivo(nombreImagen, tipo) {
  //Si la siguiente ruta existe quiere decir que ya existe una imagen para este usuario
  let pathImg = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathImg)) {
    // verifica que no exista
    fs.unlinkSync(pathImg);
  }
}
module.exports = router;
