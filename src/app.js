const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport')
const PassportLocal = require('passport-local')
const db = require('../config');
const flash = require('connect-flash');
// DB Conection


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
  };
mongoose.connect(db, options).then(
    () => { console.log("DB CONNECTED") },
    err => { console.log("Error db")}
);
//Cookies y Sesiones 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  maxAge: 3600000,
  cookie: {  maxAge: 3600000 }
}))

app.use(flash());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  next();
});

// Works
const login = require('./modules/passport.js');
const indexRoutes = require('./routes/index');
// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join( __dirname ,'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended:true }));
// Rutas

app.use('/',indexRoutes);
app.use('/asset', express.static('./'+"src/assets/"));
app.use(function(req, res, next){


  // Error 404
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.redirect('/');
    return;
  }

});
// Start server
app.listen(app.get('port'), () =>{
    console.log(`Arrancaaaamossss en el puerto ${app.get('port')}`);
});

module.exports = app;

