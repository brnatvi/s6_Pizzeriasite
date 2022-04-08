const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'nata',
    database: 'pizzeria',
    host: 'localhost',    
    password: '1234', 
    port: 5432
    });


module.exports = pool