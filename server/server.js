require('./config/config')
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())


//hablitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))


//configuracion global de las rutas
app.use(require('./routes/index'))
    //conectar con la base de datos a trabes de mongoose 
mongoose.connect(process.env.URLBD, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then((resp) => { console.log('Connected to Mongo!!'); })
    .catch(err => console.log(err))

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto:", 3000);
})