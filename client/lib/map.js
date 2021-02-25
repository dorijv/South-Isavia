import L from 'leaflet';

let map;
let markers = [];

// Býr til popup á korti út frá geojson með content
export function createPopup(geojson, content) {
  const marker = L.geoJSON(geojson).addTo(map).bindPopup(content);
  markers.push(marker);
  return marker;
}

export function clearMarkers() {
  markers.forEach((marker) => {
    map.removeLayer(marker);
  });
  markers = [];
}

// Býr til Leaflet kort og setur miðju á (0, 0) í zoom level 2
export function init(el) {
  // Búa til kort
  const options = {
    center: [0, 0],
    zoom: 2,
  };

  map = L.map(el, options);

  // Bætum við "tiles" frá OSM sem eru open source. Gætum líka
  // notað frá Google, mapbox eða fleirum en þyrftum þá aðgang
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map);
}
