const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// Configura il middleware JSON per il parsing delle richieste JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configura il middleware CORS per consentire la comunicazione tra domini diversi
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept, Access-Control-Allow-Origin',
  credentials: true
}));

// import Routes 
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/order');
const usersRoute = require('./routes/users');

app.get('/', function(req, res) {
  res.send('Benvenuto nella mia applicazione Node.js!');
});

// use Routes
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/users', usersRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Errore' });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
