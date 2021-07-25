export function clamp(x, fromX, toX) {
  let y = null;

  if (x < fromX) y = fromX;
  if (x > toX) y = toX;

  return y;
}
// вычисляем изменение движения объекта от 0 до 1. 0 - начало движения. 1 - конец
export function animateEx(diffX, startTime, currentTime, speed, looped = false) {
  const diff = currentTime - startTime;
  let time = (speed && diff / speed) || 0;

  if (looped) {
    time %= 1;
  } else if (time > 1) {
    time = 1;
  }

  return { offset: diffX * time, progress: time };
}
