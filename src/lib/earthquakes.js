/**
 * Sækja gögn frá
 * https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
 * 
 * sér í lagi, alla jarðskjálfta 4,5+ seinustu 7 daga:
 * https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson
 * 
 * Ath, í verkefni er afrit af gögnum í `./4.5_week.geojson`, gott
 * að nota það á meðan þróun stendur en skipta svo út.
 */

const URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
// const URL = './4.5_week.geojson';

export async function fetchEarthquakes() {
  // Sækja gögn frá URL, setja upp villumeðhöndlun og skila
  let result;
  
  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data.features;
}
