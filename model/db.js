const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    database: 'pizzeria',
    host: 'localhost',
    password: 'root',
    port: 5432
});

module.exports = pool;
