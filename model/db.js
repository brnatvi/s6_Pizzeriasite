const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'nata',
    database: 'pizzeria',
    host: 'localhost',    
    password: "", 
    port: 5432
    });


module.exports = pool