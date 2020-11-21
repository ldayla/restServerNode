const express = require('express')
const app = express()

//aqui importamos y usamos las rutas de los usuarios
app.use(require('./usuarios'))
app.use(require('./categoria'))
app.use(require('./login'))
app.use(require('./producto'))







module.exports = app