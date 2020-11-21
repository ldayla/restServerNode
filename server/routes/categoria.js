const express = require('express');
const { verificaRole, verificaToke } = require('../middleware/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
//=============================
//MOSTRAR TODAS LAS CATEGORIAS
//=============================
app.get("/categoria", verificaToke, (req, res) => {
    Categoria.find()
        .short('descripcion') //permite mostrar los resultado organizados por el parametro pasado
        .populate('usuario', 'nombre email') // populate me permite mostrar datos de otra colection relacionada con esta coleccion, y si le paso un segurdo parametro le paso los argumentos que quiero que me muestre de la coleccion
        .exec((err, categoriaTodas) => { // el id no lo paso porque automaticamente lo muestra
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })

            }
            res.json({ categoriaTodas })
        })



})


//=============================
//MOSTRAR UNA CATEGORIA POR ID
//=============================

app.get("/categoria/:id", verificaToke, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            categoriaBD
        })
    })
})

//=============================
//CREAR  UNA CATEGORIA 
//=============================

app.post("/categoria", verificaToke, (req, res) => {
        let body = req.body;
        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        });

        categoria.save((err, categoriaBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaBD) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoriaBD
            })

        })
    })
    //=============================
    //ACRUALIZA  UNA CATEGORIA POR ID
    //=============================

app.put("/categoria/:id", verificaToke, (req, res) => {
    let id = req.params.id
    let body = req.body
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaAct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoriaAct
        })
    })
})

//=============================
//ELIMINA  UNA CATEGORIA POR ID
//=============================

app.delete("/categoria/:id", [verificaToke, verificaRole], (req, res) => {
    // Solo puede ser borrada por un administrador
    let id = req.params.id
    Categoria.findOneAndRemove({ _id: id }, (err, categoriaEli) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaEli) {
            return res.status(400).json({
                ok: false,
                err: "ese id no existe"
            })
        }
        res.json({
            ok: true,
            categoriaEli
        })
    })

})

module.exports = app;