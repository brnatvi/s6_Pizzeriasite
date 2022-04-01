//Dependencies files required
const express=require('express');
const app = express();

//TODO: remove npm bootstrap and nodemon

// Routers init
const router = require('./routes/routes');

//TODO: to add to a middlewares/set header
//Allows to access the API from any source, add headers and send requests with the methods mentioned.
app.use((req, res, next)=>{
    //res.setHeader('','');
    next();
});

//Static files
app.use(express.static('public'));
app.use('/css', express.static( __dirname + 'public/css'));
app.use('/js', express.static( __dirname + 'public/js'));
app.use('/img', express.static( __dirname + 'public/img'));

//Set the view
//app.set('views', './views');      // Natalia: chez moi cela ne marche pas 
app.use(express.static('views'))
app.set('view engine', 'ejs');

//For parsing application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Trust first proxy
app.set('trust proxy',1)

//TODO: set express session

//Set the routes
app.use('/', router);

//Listen port
app.listen(8080, () => console.log("server started on port " + 8080));
