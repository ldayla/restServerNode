//======
// puerto
//============
process.env.PORT = process.env.PORT || 3000;

//----ENTORNO ----
//NODE_ENV  es una variable que establece heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============
// base de datos
//===============
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://ldayala:KVURBLFQaqs3PLQD@cluster0.tpyq2.mongodb.net/cafe';
}


process.env.URLBD = urlBD;