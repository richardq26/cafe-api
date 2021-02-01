const {Schema,model}=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesvalidos={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
const UserSchema = new Schema({
    name:{
        type: String, 
        required: [true,'El nombre es necesario']
    },
    email:{ 
        type: String, 
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
         type: String, 
         required: [true,'La contraseña es necesaria']
    },
    img:{
        type: String,
        required:false

    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesvalidos
    },
    estado: {   
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
},{timestamps:true});

//Cuando se imprima algo por json no se muestra la contraseña
UserSchema.methods.toJSON=function(){
    let user= this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//Valida los que tienen unique y da este mensaje personalizado
UserSchema.plugin(uniqueValidator,{ message: '{PATH} debe de ser único'});
module.exports= model("usuario",UserSchema);
