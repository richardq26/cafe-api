const jwt = require("jsonwebtoken");
//VERIFICAR TOKEN

let verificatoken = (req, res, next) => {
  let token = req.get("token"); //token o Authorization
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.usuario = decoded.usuario; //este usuario es de login.routes.js en el token=jwt.sign(usuario);
    next();
  });
};

let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role == "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El Usuario no es administrador"
      }
    });
  }
};

// OBTENER IMG, TOKEN ENVIADO POR EL URL
let verificaTokenImg=(req,res,next)=>{
  let token=req.query.token;
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.usuario = decoded.usuario; //este usuario es de login.routes.js en el token=jwt.sign(usuario);
    next();
  });
};
module.exports = {
  verificatoken,
  verificaAdmin_Role,
  verificaTokenImg
};
