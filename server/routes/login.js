const express = require('express')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {

    //let body = req.body
    let { email, password } = req.body;

    Usuario.findOne({ email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({ // porque seria un error del servidor
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ese email no existe en la bd incorrecta'
                }
            })
        }

        if (!bcrypt.compareSync(password, usuarioBD.password)) // esta funcion de bcrypt retorna true si las contraseñas hacen match o son iguales
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: ' contraseña incorrecta'
                }
            })
        }
        // aqui generamos el token
        let token = jwt.sign({
                //payload o informacion que queremos almacenar en el token
                usuario: usuarioBD
            }, process.env.SECRETO, { expiresIn: process.env.CADUCIDAD_TOKEN }) // el secreto y luego las opciones de config en este caso para que expire en 30 dias



        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })


    })


})






module.exports = app; //lo exportamos y asi tenemos guardados en el laa modificaciones