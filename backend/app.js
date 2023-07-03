const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

//import Routes 
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');

// use Routes
app.use('/api/products', productsRoute); //definisce che tutte le richieste dell'endpoint vengono gestite da productRoute
app.use('/api/users', usersRoute);

app.use(cors({
  origin: '*', //origini consentite 
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'], //metodi HTTP consentiti
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept' //header consentiti nelle richieste
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
