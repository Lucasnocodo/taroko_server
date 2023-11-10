const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts');
const adminRouter = require('./routes/admin');

const specs = require('./docs/swaggerDocs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
const corsOptions = {
  origin: '*', // This will allow requests from any domain. Adjust as necessary for security.
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly allow these methods
  preflightContinue: false,
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Then apply the CORS middleware to the Express app with the options
app.use(cors(corsOptions));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: false }));
app.use('/api', contactsRouter);
app.use('/api', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

});

// render the error page
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
