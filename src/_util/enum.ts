export function keyOf<T>(map: T, val: T[keyof T]): keyof T | undefined {
  for (const key in map) {
    if (map[key] === val) return key;
  }
  return;
}
