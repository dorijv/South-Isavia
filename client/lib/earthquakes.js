export async function fetchEarthquakes(type, period) {
  // Sækja gögn frá URL, setja upp villumeðhöndlun og skila
  let result;

  const url = new URL('/proxy', window.location);

  if (type) {
    url.searchParams.append('type', type);
  }

  if (period) {
    url.searchParams.append('period', period);
  }

  try {
    result = await fetch(url.href);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
