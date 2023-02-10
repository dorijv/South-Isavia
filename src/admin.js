import express from 'express';
import { catchErrors } from './utils.js';
import { getFlights, markFlight, markGate } from './db.js';
import passport, { ensureLoggedIn } from './authentication.js';

export const router = express.Router();

/**
 * Router serving admin.
 * 
 * @name get/admin
 */
async function admin(req, res) {
  const rows = await getFlights();

  const data = {
    title: 'ÖST - Suður',
    result: rows
  };

  return res.render('admin', data);
}

/**
 * Router serving login.
 * 
 * @name get/login
 */
async function login(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin');
  }

  let message = '';

  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('login', { title: 'ISAVIA - EFTIRLIT', message });
}

/**
 * Router serving delete.
 * 
 * Finds relevant flight by flight_id and marks it as done.
 * 
 * @name get/delete
 */
async function markFlight(req, res) {
  const { flightid, arrdep, gate } = req.body;
  await markFlight(flightid, arrdep, "_"+gate.slice(1));

  return res.redirect('/admin');
}

/**
 * Router serving closeg.
 * 
 * @name get/closeg
 */
async function closeGate(req, res) {
  const { flightid, arrdep } = req.body;
  await markGate(flightid, arrdep);

  return res.redirect('/admin');
}

router.use((req, res, next) => {
  res.locals.user = req.isAuthenticated() ? req.user : null;
  next();
});

router.get('/', ensureLoggedIn, catchErrors(admin));
router.get('/login', catchErrors(login));
router.post('/delete', ensureLoggedIn, catchErrors(markFlight));
router.post('/closeg', ensureLoggedIn, catchErrors(closeGate));
router.get('/:data', catchErrors(admin));

router.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Notendanafn eða lykilorð rangt',
    failureRedirect: '/admin/login',
  }),

  (req, res) => {
    res.redirect('/admin');
  },
);