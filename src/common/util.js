/* eslint-disable camelcase */
export default function clamp(x, from_x, to_x) {
  let anyX = null;
  if (x < from_x) anyX = from_x;
  if (x > to_x) anyX = to_x;

  return anyX;
}
