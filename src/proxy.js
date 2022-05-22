import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
import { insert, removeOldFlights } from './db.js';

export const router = express.Router();

const arrivalURL = 'https://www.isavia.is/fids/arrivals.aspx';
const departureURL = 'https://www.isavia.is/fids/departures.aspx';

const toTimestamp = (strDate) => {
  const dt = Date.parse(strDate);
  return dt / 1000;
}

async function fetchFrom(url) {
  const result = await fetch(url);
  const resJSON = await result.json();

  return resJSON;
}

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

  // Bæta við athugun á hvort hlið breyttust

  result.arrJSON.Items.forEach((flight) => {
    if( flight.Gate.charAt(0) !== 'D' && flight.Gate.charAt(0) !== 'C' && flight.Gate !== 'A15') return;
    var plusEight = new Date();
    plusEight.setHours( plusEight.getHours() + 8 );
    if (Date.parse(flight.Estimated) > Date.now() && Date.parse(flight.Estimated) <= plusEight) {
      insert(flight.No, 'A', flight.OriginDest, flight.Status, 
        flight.Scheduled, flight.Estimated, flight.Gate, false )
    }
  });

  result.depJSON.Items.forEach((flight) => {
    if( flight.Gate.charAt(0) !== 'D' && flight.Gate.charAt(0) !== 'C' && flight.Gate !== 'A15') return;
    var plusEight = new Date();
    plusEight.setHours( plusEight.getHours() + 8 );
    if (flight.Estimated === null) flight.Estimated = flight.Scheduled;
    if (Date.parse(flight.Estimated) > Date.now() && Date.parse(flight.Estimated) <= plusEight) {
      insert(flight.No, 'D', flight.OriginDest, flight.Status, 
        flight.Scheduled, flight.Estimated, flight.Gate, false )
    }
  });

  // Remove old flights
  removeOldFlights();


  return res.json(result);
});
