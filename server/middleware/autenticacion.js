const { json } = require('express');
const jwt = require('jsonwebtoken');
//===============
//Verificar Token
//===============

let verificaToke = (req, res, next) => {
    // req.get() para obtener los header, ya que ahi es donde le estoy enviando el token
    //con la siguiente expresion verificamos si el token viene por header entonces token = req.get('token')  sino token=req.query.token
    let token = req.get('token') ? req.get('token') : req.query.token

    jwt.verify(token, process.env.SECRETO, (err, decode) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //decode.usuario porque yo se que dentro del objeto que encrite viene el usuario, es decir en el payload
        req.usuario = decode.usuario; // aqui me crea un objeto usuario que envio mediante el rest a la otra funcion

        next();

    })
}

//===============
//Verificar role
//===============

let verificaRole = (req, res, next) => {
    let usuario = req.usuario
    console.log(`usuario_role: ${usuario.role}   usuario: ${usuario.email}`);
    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(400).json({
            ok: false,
            usuario,
            err: {
                message: 'nescesita ser admin'
            }
        })
    }



}


module.exports = { verificaToke, verificaRole }