//======
// puerto
//============
process.env.PORT = process.env.PORT || 3000;

//----ENTORNO ----
//NODE_ENV  es una variable que establece heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============
//caducidad del token
//===============
process.env.CADUCIDAD_TOKEN = '720h' //(60 * 60 * 24 * 30);

//===============
//SEDD SEMILLA O SECRETO DEL TOKEN
//===============
process.env.SECRETO = process.env.SECRETO || 'sercreto-del-token';

//===============
// base de datos
//===============
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}


process.env.URLBD = urlBD;
//===============
// google client id
//===============
process.env.CLIENT_ID = process.env.CLIENT_ID || '405677759949-grfm5r2mgdtse2vdnqchuf91bji9j74b.apps.googleusercontent.com'