import bcrypt from 'bcrypt';

/**
 * Middleware which catches errors.
 *
 * @param {function} fn Function
 * @param {function} next Middleware.
 */
export function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * Middleware which handles password comparison.
 *
 * @param {string}  password Submitted password
 * @param {string}  hash     Saved hash
 * @param {boolean} result   True if and only if match
 */
export async function comparePasswords(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.error('Villa við samanburð lykilorða', e);
  }
  return false;
}