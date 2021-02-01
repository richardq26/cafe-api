const {Router}=require("express");
let router = Router();
const path = require("path");
const fs= require('fs');
const {verificatoken, verificaTokenImg}=require('../middlewares/autenticacion');
router.get('/imagen/:tipo/:img',verificaTokenImg, (req,res)=>{
    let tipo= req.params.tipo;
    let img= req.params.img;
    let pathImg = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImg)){
        // sendFile opcion de file system (fs)
        res.sendFile(pathImg);
    }else{
        var noImagePath=path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
    
    
    
})


module.exports= router;