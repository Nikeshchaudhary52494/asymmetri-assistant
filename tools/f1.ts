export async function getF1NextRace() {
  const res = await fetch("https://api.jolpi.ca/ergast/f1/current/next.json", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`F1 API error: ${res.status}`);
  }

  const data = await res.json();
  const race = data.MRData.RaceTable.Races[0];

  if (!race) {
    throw new Error("No upcoming race found");
  }

  return {
    raceName: race.raceName,
    circuit: race.Circuit.circuitName,
    location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
    date: race.date,
    time: race.time ?? null,
  };
}
