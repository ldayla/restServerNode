const express = require('express')

const bcrypt = require('bcrypt');

const _ = require('underscore')

const Usuario = require('../models/usuario');
const { verificaToke, verificaRole } = require('../middleware/autenticacion');

const app = express()
    // hacemos una paginacion a los usuario
app.get('/usuario', verificaToke, function(req, res) {


    let desde = req.query.desde || 0 // para si no me envia el paramatro desde le ponemos que comience por la pagina 0
    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google') // {} => condiciones de busque 'nombre email' => un filtrado de los parametros a mostrar 
        .skip(Number(desde) * limite) // desde donde queremos mostrar
        .limit(limite) // para  que me muestre solo 5 registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ // hacemos return por si exite error que slag y no tener que seguir haciendo else y que crezca a la derecha
                    ok: false,
                    err,

                })
            }
            //{} aqui le ponemos la misma condicio de busquea que en el find para que me muestre la cantidad de usuarios sin importar el limite y el desde
            Usuario.countDocuments({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    cuantos: count,
                    usuarios

                })
            })
        })


})

app.post('/usuario', [verificaToke, verificaRole], function(req, res) {
        let body = req.body
        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10), // hashsync para que lo haga de forma sincrona, directamente din recibir un callback ni una promesa
            role: body.role
        })

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({ // hacemos return por si exite error que slag y no tener que seguir haciendo else y que crezca a la derecha
                    ok: false,
                    err,

                })
            }
            //usuarioDB.password = null;
            res.json({ // si no pongo status el pone un 200 por default
                ok: true,
                usuario: usuarioDB
            })
        })



    })
    //put es la actualizacion del registro
app.put('/usuario/:id', verificaToke, function(req, res) {
    let id = req.params.id
        // el metodo pick de underscore nos devuelve un objetos filtrando o mostrando solo los elementeos que le pasamos en el arreglo y asi de esta forma evitamos
        // que el update nos actualicen datos que no queremos como en este caso el google o password
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role'])

    /* el tercer argumento que le pasamos a la funcion es para que retorne el usuario ya con los cambios,de lo contrario retorna 
    el usuario encontrado en la bd, el runValidator para que nos corra todas las validaciones definida en el esquema, y asi no hay
     pifia  con los update
     new:true => para que devuelva el user ya actualizado
     */
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ese user no existe en la d'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

app.delete('/usuario/:id', verificaToke, function(req, res) {
    let id = req.params.id;
    // de esta manera eliminamos fisicamente de la bd el usuario
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado)
            res.json({
                ok: true,
                err: 'ese user no existe en la bD'
            })
    })
*/

    // la otra manera de eliminar el usuario de la bd es actualizando el estado false que es lo que mas se usa en la actualidad

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioAct) => {
        if (err) {
            return
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioAct
        })
    })
})

// tengo que exportarlo sin parentesis en este caso
module.exports = app;