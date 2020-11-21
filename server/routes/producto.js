const express = require('express');
const { verificaToke } = require('../middleware/autenticacion');
const categoria = require('../models/categoria');

let app = express();

let Producto = require('../models/producto')

//==========================================
// Obtener porductos
//==========================================

app.get('/producto', verificaToke, (req, res) => {
    //trae los productos
    //populate : usuario categoria
    //paginados
    let desde = req.query.desde || 0 // para si no me envia el paramatro desde le ponemos que comience por la pagina 0
    let limite = req.query.limite || 5;
    limite = limite

    Producto.find({ disponible: true })
        .skip(Number(desde) * Number(limite)) // desde dode queremos mostrar
        .limit(Number(limite))
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productosBD

            })

        })




})


//==========================================
// Obtener un producto por id
//==========================================

app.get('/producto/:id', verificaToke, (req, res) => {
    //populate : usuario categoria

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoBD) {

                return res.status(400).json({
                    ok: false,
                    message: "no existe ningun producto con ese id"
                })
            }
            res.json({
                ok: true,
                productoBD
            })
        })

})

//==========================================
// crear un nuevo producto
//==========================================

app.post('/producto', verificaToke, (req, res) => {
        //grabar el usuario
        //grabar una categoria del listado

        let body = req.body;

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            categoria: body.categoria,
            usuario: req.usuario._id
        })
        producto.save((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                message: "producto creado correctamente",
                productoBD
            })
        })
    })
    //==========================================
    // busrcar un porducto por un termino y que me muestre lo mas parecido al termino
    //==========================================
app.get('/producto/buscar/:termino', verificaToke, (req, res) => {
    let { termino } = req.params;

    let expreReg = new RegExp(termino, 'i'); // aqui estamos creando un expresion regular que no es sensible a minusculas y mayusculas,

    Producto.find({ nombre: expreReg })
        .populate('categoria', 'nombre')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productosBD) {

                return res.status(400).json({
                    ok: false,
                    message: "no existe ningun producto con ese id"
                })
            }
            res.json({
                ok: true,
                productosBD
            })
        })
})

//==========================================
// actualizar un  producto
//==========================================

app.put('/producto/:id', verificaToke, (req, res) => {
    let id = req.params.id
    let body = req.body
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'ese id no existe en la bd'
            })
        }
        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;
        productoBD.categoria = body.categoria;

        productoBD.save({ new: true }, (err, productoSav) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoSav) {
                return res.status(400).json({
                    ok: false,
                    message: 'el producto no se puedo actualizar'
                })
            }

            res.json({
                ok: true,
                productoSav
            })

        })




    })


})

//==========================================
//borrar un producto
//==========================================

app.delete('/producto/:id', verificaToke, (req, res) => {
    // cambiamos el estado de disponible a true

    let { id } = req.params
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productAct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productAct
        })
    })

})

module.exports = app;