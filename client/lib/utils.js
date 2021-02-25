import { format } from 'date-fns';

/**
 * Create an element with attributes and events, and append elements or
 * strings to it.
 *
 * Usage:
 *  const el = element(
 *    'button',
 *    { 'class': 'button' },
 *    { click: () => { ... } },
 *    'Takki'
 *   );
 *  returns
 *  <button class="button">Takki</button> with a click handler.
 *
 * @param {string} name Element name
 * @param {object} attributes Object containing attributes to attach to element.
 * @param {object} events Object of events to add to element.
 * @param  {...any} children List of elements or strings to append to element.
 * @returns {object} HTML element.
 */
export function element(name, attributes = null, events = null, ...children) {
  const e = document.createElement(name);

  // eslint-disable-next-line no-restricted-syntax
  for (const child of children) {
    if (!child) {
      continue;
    }

    if (attributes) {
      for (const attrib in attributes) {
        e.setAttribute(attrib, attributes[attrib]);
      }
    }

    if (events) {
      // eslint-disable-next-line no-restricted-syntax
      for (const event in events) {
        e.addEventListener(event, events[event]);
      }
    }

    if (typeof child === 'string') {
      e.appendChild(document.createTextNode(child));
    } else {
      e.appendChild(child);
    }
  }

  return e;
}

/**
 * Simplified element function.
 * Creates an element and append elements or strings to it.
 *
 * @param {string} name Element name
 * @param  {...any} children List of elements or strings to append to element.
 * @returns {object} HTML element.
 */
export function el(name, ...children) {
  return element(name, null, null, ...children);
}

/**
 * Format a timestamp as dd.mm.yyyy hh:mm:ss e.g. "01.11.2020 12:00:00".
 *
 * @param {number} timestamp Unix timestamp to format
 * @returns {string} Formatted string.
 */
export function formatDate(timestamp) {
  // Útfæra með „vanilla JS“ eða nota date-fns pakka
  return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss');
}
