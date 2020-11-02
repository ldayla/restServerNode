const express = require('express')
const app = express()

//aqui importamos y usamos las rutas de los usuarios
app.use(require('./usuarios'))

app.use(require('./login'))







module.exports = app