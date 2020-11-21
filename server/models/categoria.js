const mongosse = require('mongoose');
const usuario = require('./usuario');
const Schema = mongosse.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, ' la descripcion es requerida'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongosse.model('Categoria', categoriaSchema)