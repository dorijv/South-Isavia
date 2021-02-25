export function timerStart() {
  return process.hrtime();
}

export function timerEnd(since) {
  const diff = process.hrtime(since);
  const elapsed = diff[0] * 1e9 + diff[1];
  const elapsedAsSeconds = elapsed / 1e9;

  return Number(elapsedAsSeconds.toFixed(4));
}
