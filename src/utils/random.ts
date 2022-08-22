export const generateRandomNumbersArray = (
  total: number,
  max: number
): number[] => {
  const set = new Set<number>();
  while (set.size < total) {
    set.add(Math.floor(Math.random() * max) + 1);
  }

  return Array.from(set);
};
