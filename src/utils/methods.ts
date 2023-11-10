export const generateArray = <T>(
  start: number,
  end: number,
  callback: (index: number) => T
) => {
  const array: T[] = [];
  for (let index = start; index <= end; index++) {
    array.push(callback(index));
  }
  return array;
};
