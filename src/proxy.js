import express from 'express';
import fetch from 'node-fetch';

import { get, set } from './cache.js';
import { timerStart, timerEnd } from './time.js';

export const router = express.Router();

function usgsUrl(type, period) {
  return `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
}

async function fetchFromUsgs(url) {
  const result = await fetch(url);
  const json = await result.json();

  return json;
}

router.get('/', async (req, res) => {
  const { type, period } = req.query;

  const url = usgsUrl(type, period);
  const cacheKey = `type:${type}-period:${period}`;

  const timer = timerStart();

  let data;

  const cached = await get(cacheKey);

  if (cached) {
    data = cached;
  } else {
    data = await fetchFromUsgs(url);
    set(cacheKey, data, 60);
  }

  const elapsed = timerEnd(timer);

  const result = {
    data,
    info: {
      cached: cached != null,
      elapsed,
    },
  };

  return res.json(result);
});
