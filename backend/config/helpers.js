const Mysqli = require('mysqli');


//collegamento al database mysql usando il localhost
let conn = new Mysqli({
    host:'localhost',
    post: 3306,
    user: 'root',
    passwd: '',
    db: 'progetto_web'
});

let db = conn.emit(false,'');


//facendo l'export con require in altri punti posso accedere a db
module.exports = {
    database:db
};

const expiresInDays = 90; // Durata dell'accesso in giorni
const expiresInMilliseconds = expiresInDays * 24 * 60 * 60 * 1000; // Conversione in millisecondi


module.exports.env = {
    JWT_SECRET: 'fnorn483onf3oihw9fh39qr9f29',
    JWT_EXPIRE_IN: expiresInMilliseconds,
    JWT_COOKIE_EXPIRES: 90,
};

