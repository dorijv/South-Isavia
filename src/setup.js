/* eslint-disable no-plusplus */
import pg from 'pg';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';

async function readFileAsync(sql) {
  try {
    const file = await fs.readFile(sql);
    return file;
  } catch (e) {
    throw new Error(e);
  }
}

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
  } catch (e) {//eslint-disable-line
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  await query('DROP TABLE IF EXISTS signatures');
  console.info('Töflu eytt');

  try {
    const createTable = await readFileAsync('./schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }
}

main().catch((err) => {
  console.error(err);
});