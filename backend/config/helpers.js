const Mysqli = require('mysqli');

let conn = new Mysqli({
    host:'localhost',
    post: 3306,
    user: 'root',
    passwd: '',
    db: 'progetto_web'
});

let db = conn.emit(false,'');

module.exports = {
    database:db
};

