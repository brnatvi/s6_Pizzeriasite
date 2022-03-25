const express = require("express");
const serv = express();

// Static files
serv.use(express.static('views'));
serv.set('view engine', 'ejs');

const PORT = 8080;


// index page
serv.get('/', function (req, res) {
    
});

serv.get("/menu/:id/", (req, res) => {
  
});

serv.get("/livraison/:id/", (req, res) => {

});


serv.listen(PORT, () => console.log("server started on port " + PORT));
