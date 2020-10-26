require('./config/config')
const express = require('express')
const app = express()
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', function(req, res) {
    res.json('esta es una peticion get')
})

app.post('/usuario', function(req, res) {
    let body = req.body
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "el nombre es necerio"
        })
    } else {
        res.json({ body })
    }

})
app.put('/', function(req, res) {
    let id = req.params.id
    res.json({ id })
})
app.delete('/usuario/:id', function(req, res) {

})

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto:", 3000);
})