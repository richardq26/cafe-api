const {Schema,model}=require('mongoose');


var categoriaSchema= new Schema({
    descripcion:{
        type: String,
        unique: true,
        required:[true,'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }
});

module.exports=model("Categoria",categoriaSchema);