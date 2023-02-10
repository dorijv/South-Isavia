/**
 * Proxy to circumvent the CORS policy
 * 
 * @Author Halldór Jens Vilhjálmsson
 */

import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
import { insert, removeOldFlights } from './db.js';

export const router = express.Router();

const arrivalURL = 'REDACTED';
const departureURL = 'REDACTED';

const toTimestamp = (strDate) => {
  const dt = Date.parse(strDate);
  return dt / 1000;
}

async function fetchFrom(url) {
  const result = await fetch(url);
  const resJSON = await result.json();

  return resJSON;
}

/**
 * Router serving proxy.
 * 
 * @name get/proxy
 */
router.get('/', async (req, res) => {
  const timer = timerStart();
  let arrJSON;
  let depJSON;
  try {
    arrJSON = await fetchFrom(new URL(`?_=${Date.now()}`,arrivalURL));
    depJSON = await fetchFrom(new URL(`?_=${Date.now()}`,departureURL));
  } catch (e) {
    console.log(e);
  }

  const elapsed = timerEnd(timer);

  const result = {
    arrJSON,
    depJSON,
    elapsed
  };

  result.arrJSON.Items.forEach((flight) => {
    if( 'REDACTED' ) return;
    if (flight.Estimated == null) flight.Estimated = flight.Scheduled;
    var plusEight = new Date();
    plusEight.setHours( plusEight.getHours() + 8 );
    if (Date.parse(flight.Estimated) > Date.now() && Date.parse(flight.Estimated) <= plusEight) {
      insert(flight.No, 'A', flight.OriginDest, flight.Status, 
        flight.Scheduled, flight.Estimated, flight.Gate, false )
    }
  });

  result.depJSON.Items.forEach((flight) => {
    if( 'REDACTED') return;
    if (flight.Estimated == null) flight.Estimated = flight.Scheduled;
    var plusEight = new Date();
    plusEight.setHours( plusEight.getHours() + 8 );
    if (flight.Estimated === null) flight.Estimated = flight.Scheduled;
    if (Date.parse(flight.Estimated) > Date.now() && Date.parse(flight.Estimated) <= plusEight) {
      insert(flight.No, 'D', flight.OriginDest, flight.Status, 
        flight.Scheduled, flight.Estimated, flight.Gate, false )
    }
  });

  removeOldFlights();

  return res.json(result);
});
