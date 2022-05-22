import { fetchFlights } from './lib/flights';
import { el, element, formatDate } from './lib/utils';

async function fetchAndRenderFlights() {
  const result = await fetchFlights();
}

document.addEventListener('DOMContentLoaded', async () => {

  window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM FULLY LOADED');
    fetchAndRenderFlights();
  });
});
