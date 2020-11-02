import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup } from './lib/map';

document.addEventListener('DOMContentLoaded', async () => {
  // Hér er allt „vírað“ saman

  const earthquakes = await fetchEarthquakes();

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn
  const loading = document.querySelector('.loading');
  const parent = loading.parentNode;
  parent.removeChild(loading);

  if (!earthquakes) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn')
    );
  }

  const ul = document.querySelector('.earthquakes');
  const map = document.querySelector('.map');

  init(map);

  earthquakes.forEach((quake) => {

    const { title, mag, time, url } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent =
      el('div',
        el('h3', title),
        el('p', formatDate(time)),
        el('p', link)
      );
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup()
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString()),
        ),
        element('div', { 'class': 'buttons' }, null,
          element('button', null, { 'click': onClick }, 'Sjá á korti'),
          link,
        ),
      ),
    );

    ul.appendChild(li);
  });
});
