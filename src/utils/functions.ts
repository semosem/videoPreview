export const parseTime = (time: string): number => {
  let totalSeconds = 0;
  if (time.includes(":")) {
    const [min, sec] = time.split(":").map((n) => parseInt(n, 10));
    if (!isNaN(min) && !isNaN(sec)) {
      totalSeconds = min * 60 + sec;
    }
  } else {
    const inputNum = parseInt(time, 10);
    if (!isNaN(inputNum)) {
      totalSeconds = inputNum * 60; // Treat single numbers as minutes
    }
  }
  return totalSeconds;
};
