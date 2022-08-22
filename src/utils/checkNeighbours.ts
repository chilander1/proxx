/************************ 
To get surrounding cells we do `index` + 1, `index` -1, 
and the same on a row before and row after plus `index` - `width` and `index` + `width`.
And at the end we have extra filtering to remove cells which out of the scope
************************/

export const checkNeighbours = (
  index: number,
  width: number,
  height: number
) => {
  const max = width * height;
  const indexes = [];
  const currentColumnPlace = Math.ceil(index % width) || width;
  const topNeighbor = index - width;
  const bottomNeighbor = index + width;

  if (currentColumnPlace - 1 > 0) {
    indexes.push(index - 1);
  }

  if (currentColumnPlace + 1 <= width) {
    indexes.push(index + 1);
  }

  const getNeighbour = (positionIndex: number) => {
    const curr = Math.ceil(positionIndex % width) || width;
    indexes.push(positionIndex);

    if (curr + 1 <= width && curr + 1 === currentColumnPlace + 1) {
      indexes.push(positionIndex + 1);
    }

    if (curr - 1 > 0 && curr - 1 === currentColumnPlace - 1) {
      indexes.push(positionIndex - 1);
    }
  };

  if (topNeighbor) {
    getNeighbour(topNeighbor);
  }

  if (bottomNeighbor && bottomNeighbor <= max) {
    getNeighbour(bottomNeighbor);
  }

  //
  return indexes.filter((item) => item >= 1 && item <= max);
};
