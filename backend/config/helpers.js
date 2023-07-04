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

