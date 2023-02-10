import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';

import { router as proxyRouter } from './proxy.js';
import { router as adminRouter } from './admin.js';
import { router as r } from './ind.js';

import passport from './authentication.js';


dotenv.config();

const {
  PORT: port = 3009,
  SESSION_SECRET: sessionSecret,
  DATABASE_URL: connectionString,
} = process.env;

const app = express();

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000, // 20 sek
}));

// Sér um að req.body innihaldi gögn úr formi
app.use(express.urlencoded({ extended: true }));

const path = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(path, '../public')));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

/**
 * Middleware which handles 404 errors.
 *
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Next middleware
 */
// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, next) {
  const title = 'Síða fannst ekki';
  res.status(404).render('error', { title });
}

/**
 * Middleware which takes care of error handling.
 *
 * @param {object} err Relevant error
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Next middleware
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const title = 'Villa kom upp';
  res.status(500).render('error', { title });
}
app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});
app.use('/', r);
app.use('/proxy', proxyRouter);
app.use('/admin', adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
