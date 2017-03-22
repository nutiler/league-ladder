'use strict'

// Express app.
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const ip = process.env.IP || '127.0.0.1';

// Knex Database.
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile.js')[environment];
const knex = require('./knex')(config);

// Middleware plugins.
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const hbs = require('hbs');


// Application Routes.
const users = require('./routes/users');
const auth = require('./routes/auth');
const stats = require('./routes/stats');

// Helpers for Handlebars.js limit reduces views.
hbs.registerHelper('select', function(selected, options) {
    return options.fn(this)
        .replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
});
hbs.registerHelper('limitSort', function (arr, limit, key) {
  		return arr.sort(function(a, b) {
			var x = a[key],
			y = b[key];

			return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		}).slice(0, limit);
});

// Use Middlewares
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieSession({
    secret: "league-ladder",
}))
app.use(require('flash')());

// Use Routes
app.use('/users', users);
app.use('/auth', auth);
app.use('/stats', stats);

app.listen(port, function() {
    console.log('league-ladder using port: ', ip + ':' + port);
});

module.exports = app;
