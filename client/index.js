import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup, clearMarkers } from './lib/map';

async function fetchAndRenderEarthquakes(type, period, title) {
  const loading = document.querySelector('.loading');
  const ul = document.querySelector('.earthquakes');
  const h1 = document.querySelector('h1');
  const cacheInfo = document.querySelector('p.cache');

  ul.textContent = '';
  h1.textContent = '';
  cacheInfo.textContent = '';

  clearMarkers();
  loading.classList.remove('hidden');
  const result = await fetchEarthquakes(type, period);
  loading.classList.add('hidden');

  const parent = loading.parentNode;

  if (!result) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn'),
    );
  }

  h1.textContent = title;
  cacheInfo.textContent = `Gögn eru ${result.info.cached ? '' : 'ekki'} í cache. Fyrirspurn tók ${result.info.elapsed} sek.`;

  result.data.features.forEach((quake) => {
    const {
      title: quakeTitle, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', quakeTitle),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', quakeTitle),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const map = document.querySelector('.map');

  init(map);

  const links = document.querySelectorAll('ul.nav a');

  links.forEach((link) => {
    const heading = link.closest('.list').querySelector('h2');
    const url = new URL(link.href);
    const { searchParams } = url;

    const period = searchParams.get('period');
    const type = searchParams.get('type');

    const title = `${link.textContent}, ${heading.textContent.toLocaleLowerCase()}`;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      fetchAndRenderEarthquakes(type, period, title);
    });
  });
});
