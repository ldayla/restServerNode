const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const { verificaToke } = require('../middleware/autenticacion')

app.get('/imagen/:tipo/:img', (req, res) => {
    let { tipo, img } = req.params;

    let pathIma = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathIma)) {
        res.sendFile(pathIma)
    } else {
        let pathNoIma = path.resolve(__dirname, `../assets/no-img.png`);
        res.sendFile(pathNoIma)
    }

})












module.exports = app;