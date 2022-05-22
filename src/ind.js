import express from 'express';
import xss from 'xss';
import { catchErrors } from './utils.js';
import session from 'express-session';
import passport, { ensureLoggedIn } from './authentication.js';
export const router = express.Router();

async function index(req, res) {
	res.render('index', { 'title': 'ISAVIA - EFTIRLIT' });
}

router.get('/', catchErrors(index));

