const toTimestamp = (strDate) => {
  const dt = Date.parse(strDate);
  return dt / 1000;
}

export async function fetchFlights() {
  // Sækja gögn frá URL, setja upp villumeðhöndlun og skila
  let result;

  const url = new URL('/proxy', window.location);

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
  /*//NSERT INTO flights(flightID, arrDepBool, origin, status, scheduled, estimated, finished)
  data.arrJSON.Items.forEach((flight) => {
    if (Date.parse(flight.Estimated) > Date.now() && Date.parse(flight.Estimated) <= Date.now().addHours(8)) {
      insert(flight.No, 'A', flight.OriginDest, flight.Status, 
        toTimestamp(flight.Scheduled), toTimestamp(flight.Estimated), False );
    }
  });
  */

  return data;
}
