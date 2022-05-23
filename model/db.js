const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'nata',            /* A CHANGER */
    database: 'pizzeria',
    host: 'localhost',    
    password: '1234',        /* A CHANGER */
    port: 5432
    });

module.exports = pool