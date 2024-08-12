const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up Handlebars.js as the template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Use the routes defined in the controllers
app.use(routes);

// Sync sequelize models to the database, then start the Express.js server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening on PORT ' + PORT));
});
