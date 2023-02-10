const toTimestamp = (strDate) => {
  const dt = Date.parse(strDate);
  return dt / 1000;
}

export async function fetchFlights() {
  let result;

  const url = new URL('/proxy', window.location);

  try {
    result = await fetch(url.href);
  } catch (e) {
    console.error('Error fetching data: ', e);
    return null;
  }

  if (!result.ok) {
    console.error('Invalid response code', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
