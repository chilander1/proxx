import React from "react";
import clsx from "clsx";
import styles from "./style.module.scss";

type TProps = {
  index: number;
  isHole: boolean;
  isOpen: boolean;
  onDemine: (key: number) => void;
  adjacentBlackHoles: number;
};

const BoardCell = ({
  index,
  isHole,
  isOpen,
  onDemine,
  adjacentBlackHoles,
}: TProps) => {
  const handleCellClick = () => {
    if (!isOpen) {
      onDemine(index);
    }
  };

  return (
    <div
      className={clsx(styles.cell, {
        [styles.open]: isOpen && !isHole,
        [styles.withBomb]: isOpen && isHole,
      })}
    >
      <button onClick={handleCellClick}>
        {isOpen && adjacentBlackHoles > 0 && <span>{adjacentBlackHoles}</span>}
      </button>
    </div>
  );
};

export default BoardCell;
