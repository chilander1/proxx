import React, { useMemo } from "react";
import clsx from "clsx";
import Button from "../../components/Button";
import styles from "./style.module.scss";
import BoardCell from "./BoardCell";

type TProps = {
  gridList: { key: number }[];
  width: number;
  height: number;
  gameStatus: "not-started" | "in-progress" | "loss" | "win";
  cells: {
    [key: number]: {
      isOpen: boolean;
      isHole: boolean;
      amountNeighboringCellsWithHoles: number;
    };
  };
  onDemine: (key: number) => void;
  onResetGame: () => void;
  onResetCells: () => void;
};

const GameBoard = ({
  gridList,
  gameStatus,
  cells,
  width,
  height,
  onDemine,
  onResetGame,
  onResetCells,
}: TProps) => {
  const isDisabled = useMemo(
    () => gameStatus === "loss" || gameStatus === "win",
    [gameStatus]
  );
  return (
    <div className={styles.wrap}>
      <div
        className={clsx(styles.board, { [styles.disabled]: isDisabled })}
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

      {isDisabled && (
        <div className={styles.footer}>
          <h3>YOU {gameStatus === "loss" ? "LOST" : "WIN"}!</h3>
          <Button color="white" onClick={onResetCells}>
            Try again
          </Button>
          <Button color="blue" onClick={onResetGame}>
            Main menu
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
