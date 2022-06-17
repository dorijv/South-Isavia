import express from 'express';
import { catchErrors } from './utils.js';
//import { deleteRow, getSignatures, getTotalSignatureCount } from './db.js';
import { testGetFlights, markFlight, markGate } from './db.js';
import passport, { ensureLoggedIn } from './authentication.js';

export const router = express.Router();


async function admin(req, res) {
  const rows = await testGetFlights();

  const data = {
    title: 'ÖST - Suður',
    result: rows
  };

  return res.render('admin', data);
}

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

async function deleteSignature(req, res) {
  const { flightid, arrdep, gate } = req.body;
  await markFlight(flightid, arrdep, "_"+gate.slice(1));

  return res.redirect('/admin');
}

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
router.post('/delete', ensureLoggedIn, catchErrors(deleteSignature));
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