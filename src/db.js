import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, v = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(q, v);
    return result.rows;
  } catch (e) {
    throw new Error(e);
  } finally {
    client.release();
  }
}

export async function insert(flightID, arrDepBool, origin, status, scheduled, estimated, gate, finished) {
  const q = 'INSERT INTO flights(flightID, arrDepBool, origin, status, scheduled, estimated, gate, finished) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  const values = [flightID, arrDepBool, origin, status,
                  scheduled, estimated, gate, finished];

  try {
    await query(q, values);
  } catch (e) {
    console.error('Error', e);
    checkUpdate(flightID, gate);
    return 'error';
  }

  return null;
}

export async function getSignatures(offset = 0, limit = 50) {
  try {
    const q = 'SELECT * FROM signatures ORDER BY signed DESC, id OFFSET $1 LIMIT $2 ';
    const result = await query(q, [offset, limit]);

    return result;
  } catch (e) {
    console.error('Error selecting', e);
  }
  return null;
}

export async function getTotalSignatureCount() {
  try {
    const q = 'SELECT COUNT(*) FROM signatures';
    const result = await query(q);

    return result;
  } catch (e) {
    console.error('Error selecting', e);
  }
  return null;
}

export async function deleteRow(id) {
  const q = 'DELETE FROM signatures WHERE id = $1';

  return query(q, id);
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.length === 1) {
      return result[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await query(q, [username]);
    return result[0];
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }
}

export async function testGetFlights() {
  const q = "SELECT *, TO_CHAR(estimated, 'HH24:MI') FROM flights WHERE finished = false ORDER BY estimated";
    try {
      const result = await query(q);
      console.log(result)
      return result;
  } catch (e) {
      console.error('Gat ekki sótt flug!');
      return null;
  }
}

export async function removeOldFlights() {
  const q = 'DELETE FROM FLIGHTS * WHERE estimated < CURRENT_TIMESTAMP';
  try {
    const result = await query(q);
    return result;
  } catch (e) {
    console.error('db.js REMOVEOLDFLIGHTS: Gat ekki eytt flugum');
    return null;
  }
}

export async function findGate(flightid) {
  const q = 'SELECT gate FROM FLIGHTS WHERE flightid like $1';
  try {
    const result = await query(q, [flightid]);
    return result[0];
  } catch(e) {
    console.error('Gat ekki sótt hlið frá flugnúmeri', e);
    return null;
  }
}

export async function fixGate(flightid, gate) {
  const q = 'UPDATE FLIGHTS SET gate = $1, finished = false WHERE flightid LIKE $2';
  try {
    const result = await query(q, [gate, flightid]);
    return result;
  } catch(e) {
    console.error('Gat ekki uppfært flug!', e);
    return null;
  }
}

export async function markFlight(flightid, arrdep) {
  const q = 'UPDATE FLIGHTS SET finished = true WHERE flightid LIKE $1 AND arrDepBool LIKE $2';
  try {
    const result = await query(q, [flightid, arrdep]);
    console.log('Flug merkt!', flightid, arrdep);
    return result;
  } catch(e) {
    console.error('Gat ekki merkt flug', e);
    return null;
  }
}

async function checkUpdate(flightid, gate) {
  let oldGate = await findGate(flightid);
  console.log(oldGate.gate);
  if (oldGate.gate !== gate) {
    fixGate(flightid, gate);
  }
}