const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');
//const { delete } = require('../routes/usuarios');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido' // mensaje de error si rl rol no es de los de arriba, {VALUE}=> inyectaria el rol que el usuario envia
}

let usuarioSchema = new Schema({
        nombre: {
            type: String,
            required: [true, "el nombre es requerido"] // le pongo un mensaje porque sino me pone el mensaje por defecto de error
        },
        email: {
            type: String,
            required: [true, "el correo es requerido"],
            unique: [true, 'ese correo ya existe en la bd']
        },
        password: {
            type: String,
            required: [true, 'el pass es obligatorio']
        },
        img: { // no es obligatoria
            type: String,
            required: false
        },
        role: { // default :'USER_ROLE'
            type: String,
            default: 'USER_ROLE',
            enum: rolesValidos
        },
        estado: { // boolean
            type: Boolean,
            default: true
        },
        google: { // si el usuario no se crea con la propiedad de google siempre va a ser un usuario normal y va a estar en false
            type: Boolean,
            default: false
        }, // boolean

    })
    // aqui en el esquema modificamos el metodo toJSON para no mostrar la contraseña ya que este metodo siempre se llama cuando se va a imprimir 
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let useObject = user.toObject(); // con esto ya tenemos todas las propiedades y funciones del objeto
    delete useObject.password;
    return useObject;
}
usuarioSchema.plugin(uniquevalidator, { message: 'el {PATH}  debe ser unico' })
module.exports = mongoose.model('Usuario', usuarioSchema)