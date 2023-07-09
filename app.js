const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

// passport config
require('./config/passport')(passport);

// connectDB
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }   
})) 

// Logging 
if (process.env.NODE_ENV === 'development'){ 
    app.use(morgan('dev'));
};

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon, select  } = require('./helpers/hps');

// Handlebars
app.engine('.hbs', exphbs.engine({helpers: {formatDate, truncate, stripTags, editIcon, select}, defaultLayout : 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))

// passport  middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variable
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})
// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// static folder 
app.use(express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
