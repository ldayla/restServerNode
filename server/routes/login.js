const express = require('express')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
    // para usar la api de google-sign-in
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const { json } = require('express');

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

// ====== CONFIGURACIONES DE GOOGLE =======


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    // console.log('email:' + payload.email);
    // console.log('nombre:' + payload.name);
    //console.log('picture:' + payload.picture);
    // aqui creamos el objeto que vamos a guardar en usuario, no le pasamos contraseña porque es autenticado por google
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }
}



app.post('/google', async(req, res) => { //hacemos por en google
    let token = req.body.idtoken //recibimos el token
        //console.log(`este es el token de google, ${token.idtoken}`);
    let googleUser = await verify(token) // aqui verificamos el token con la funcion de google y si es correcto voy a tener un objeto 
        .catch(e => { // llamado googleUser con la informacion del usuario
            return res.status(403).json({
                ok: false,
                message: "error el token de google no es correcto",
                err: e
            })
        })

    Usuario.find({ email: googleUser.email }, (err, usuarioBD) => { // verifico si en mi bd tengi un user con ese correo

        if (err) {
            return res.status(500).json({ // porque seria un error del servidor
                ok: false,
                err
            })
        }

        if (usuarioBD) { //si es true es que el usuario ya se ha autenticado
            if (usuarioBD.google === false) { // si es false el usurio no se ha autenticado por google
                console.log('user no autenticado pero no en google:' + usuarioBD);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe utilizar autenticacion normal'
                    }
                })
            } else { // como ya  ha sido autenticado por google renuevo su token para que siga trabajando
                console.log(`usuario autenticado con google: email: ${usuarioBD.nombre}`);
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SECRETO, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    message: "usuario autenticado por google y token renovado",
                    usuario: usuarioBD,

                    token

                })

            }
        } else { // si el usuario no existe en nuestra db
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; // aqui ponemos una contra para pasara la validacion del esquema ya que es requerida pero este password nunca lo usamos ya que usamos el de google
            usuario.save((err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ // porque seria un error del servidor
                        ok: false,
                        err
                    })
                } else {
                    console.log("user de google creado en la bd");
                }
            })
        }

    })
})


module.exports = app; //lo exportamos y asi tenemos guardados en el laa modificaciones