import React from "react";

import styles from "./style.module.scss";
import BoardCell from "../BoardCell";

type TProps = {
  gridList: { key: number }[];
  width: number;
  height: number;
  cells: {
    [key: number]: {
      isOpen: boolean;
      isHole: boolean;
      neighboringCells: number[];
      amountNeighboringCellsWithHoles: number;
    };
  };
  onDemine: (key: number) => void;
};

const CellsGrid = ({ gridList, width, height, cells, onDemine }: TProps) => {
  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${width}, 40px)`,
        gridTemplateRows: `repeat(${height}, 40px)`,
        // need to set width in order to not have an issue with cutting grid when width = 40
        width: `calc(${width} * 50px)`,
      }}
    >
      {gridList.map((item) => (
        <BoardCell
          key={item.key}
          index={item.key}
          isHole={cells[item.key].isHole}
          isOpen={cells[item.key].isOpen}
          adjacentBlackHoles={cells[item.key].amountNeighboringCellsWithHoles}
          onDemine={onDemine}
        />
      ))}
    </div>
  );
};

export default CellsGrid;
