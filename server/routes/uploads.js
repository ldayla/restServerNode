const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
let Usuario = require('../models/usuario')
let Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')
    // default options
    // cuando llamammos este middleware todos los archivos que se cargen caen dentro de req.files es decir:
    // transsforma todo lo que sea que se esta subiendo y lo coloca en un objeto llamado files
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.put('/upload/:tipo/:id', function(req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: true,
            err: { message: 'no ha seleccionado ningun archivo para subir' }
        });
    }
    // El nombre del campo de entrada (es decir, "archivo") se usa para recuperar el archivo cargado, es decir archivo va  ser el nombre que 
    // va a tener el input que va a cargar el archivo para subir
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]
    let { tipo, id } = req.params
    let extensiones = ['png', 'gif', 'jpg', 'jpeg']

    if (extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "las extensiones validas son " + extensiones.join(', ')
            }
        })
    }

    let tiposValidos = ['producto', 'usuario']
    if (tiposValidos.indexOf(tipo) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: "los tipos vaidos son " + tiposValidos.join(', ')
            }
        })

    //cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
        // Usa el método mv () para colocar el archivo en algún lugar de tu servidor
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err,
                message: "no coloco el archivo"
            });
        // aqui ya sabemos que la imagen se ha cargado
        imagenUsuarioProducto(id, res, nombreArchivo, tipo)

    });


});

function imagenUsuarioProducto(id, res, nombreArchivo, tipo) {
    let variable;
    if (tipo === "usuario") {
        variable = Usuario;
    } else {
        variable = Producto;
    }
    variable.findById(id, (err, resultBD) => {
        if (err) {

            borrarArchivo(tipo, nombreArchivo)
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!resultBD) {
            borrarArchivo(tipo, nombreArchivo)
            return res.status(400).json({
                ok: false,
                err: {
                    message: `ese ${tipo} no existe`
                }
            });
        }

        borrarArchivo(tipo, resultBD.img)

        resultBD.img = nombreArchivo;
        resultBD.save((err, resultGuardado) => {
            res.json({
                ok: true,
                img: nombreArchivo,
                resultGuardado
            })
        })

    })
}



function borrarArchivo(tipo, nombreImagen) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl)
        console.log("imagen borrada");
    }
}
module.exports = app