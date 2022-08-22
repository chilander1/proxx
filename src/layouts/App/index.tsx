import React, { useState, useEffect } from "react";
import { FieldValues } from "react-hook-form";

import Settings from "../../scenes/Settings";
import GameBoard from "../../scenes/GameBoard";
import styles from "./style.module.scss";
import { generateRandomNumbersArray } from "../../utils/random";
import { checkNeighbours } from "../../utils/checkNeighbours";

interface GridListSettings {
  list: { key: number }[];
  settings?: {
    width: number;
    height: number;
    holes: number[];
  };
}

interface CellStatusItem {
  isOpen: boolean;
  isHole: boolean;
  neighboringCells: number[];
  amountNeighboringCellsWithHoles: number;
}

interface CellsStatusData {
  cells: {
    [key: number]: CellStatusItem;
  } | null;
}

interface GameStatusData {
  status: "not-started" | "in-progress" | "loss" | "win";
  openCells: number;
}

function App() {
  const [grid, setGrid] = useState<GridListSettings>({
    list: [],
  });
  const [cellsStatus, setCellsStatus] = useState<CellsStatusData>({
    cells: null,
  });
  const [gameStatus, setGameStatus] = useState<GameStatusData>({
    status: "not-started",
    openCells: 0,
  });

  useEffect(() => {
    const listLength = grid.list.length;
    if (
      listLength > 0 &&
      cellsStatus.cells &&
      grid.settings &&
      gameStatus.status !== "loss"
    ) {
      const openCells = grid.list.reduce(
        (acc, item) =>
          cellsStatus?.cells && cellsStatus.cells[item.key].isOpen
            ? acc + 1
            : acc,
        0
      );
      let status: any;

      if (listLength - openCells === grid.settings.holes.length) {
        status = "win";
      } else {
        status = "in-progress";
      }
      setGameStatus({ openCells, status });
    }
  }, [cellsStatus.cells, grid.list, grid.settings, gameStatus.status]);

  const handleSubmitSettingsForm = ({
    width,
    height,
    blackHolesAmount,
  }: FieldValues) => {
    const emptyArr = new Array(width * height);
    const holesIndexes = generateRandomNumbersArray(
      blackHolesAmount,
      emptyArr.length
    );

    const list = [...emptyArr].map<{ key: number }>((_item, index) => ({
      key: index + 1,
    }));

    const cellsState = getCellsState(emptyArr, holesIndexes);

    setCellsStatus({ cells: cellsState });
    setGrid({
      list,
      settings: { width, height, holes: holesIndexes },
    });
  };

  const getCellsState = (arr: any[], holes: number[]) => {
    return [...arr].reduce<Record<number, CellStatusItem>>(
      (acc, _item, index) => {
        const key = index + 1;

        acc[key] = {
          isHole: holes.includes(key),
          isOpen: false,
          neighboringCells: [],
          amountNeighboringCellsWithHoles: 0,
        };

        return acc;
      },
      {}
    );
  };

  const getExtraCellsToOpen = (neighbors: number[]) => {
    const { cells } = cellsStatus;
    const extraCells: number[] = [];
    const data: { [key: number]: CellStatusItem } = {};

    if (cells && grid?.settings) {
      const { width, height } = grid?.settings;

      // recursively surrounding cells check
      const findEmptyCells = (neighbors: number[]) => {
        neighbors.forEach((cell) => {
          const neighboringCells = checkNeighbours(cell, width, height);

          const filtered = neighboringCells.filter((nc) => {
            const neigb = checkNeighbours(nc, width, height);
            const amount = getBlackHolesAmount(neigb);

            return amount === 0 && !extraCells.includes(nc);
          });

          if (filtered.length > 0) {
            extraCells.push(...filtered, cell);

            findEmptyCells(filtered);
          }
        });
      };

      findEmptyCells(neighbors);

      // need to do one more check on cells that have black holes in neighbors
      const getNeighboursWithHoles = (
        neighboringCells: number[],
        n: number
      ) => {
        neighboringCells.forEach((cell) => {
          const subNeighboringCells = checkNeighbours(cell, width, height);
          const amount = getBlackHolesAmount(subNeighboringCells);

          if (!cells[+cell].isHole && !cells[+cell].isOpen && !data[cell]) {
            data[cell] = {
              ...cells[cell],
              isOpen: true,
              amountNeighboringCellsWithHoles: amount,
            };
          }

          // 1 Extra call
          if (n === 0) {
            getNeighboursWithHoles(subNeighboringCells, 1);
          }
        });
      };

      getNeighboursWithHoles(extraCells, 0);
    }

    return data;
  };

  // method returns the number of black holes surrounding the cell
  const getBlackHolesAmount = (neighboringCells: number[]): number => {
    const { cells } = cellsStatus;
    if (cells) {
      return neighboringCells.reduce(
        (acc, item) =>
          cells[+item].isHole && !cells[+item].isOpen ? acc + 1 : acc,
        0
      );
    }

    return 0;
  };

  const handleDemine = (index: number) => {
    const { cells } = cellsStatus;
    if (cells) {
      const current = cells[index];

      // Check For LOSS
      if (current.isHole) {
        const holesData = grid?.settings?.holes.reduce<
          Record<number, CellStatusItem>
        >((acc, item) => {
          acc[item] = {
            ...cells[index],
            isOpen: true,
          };

          return acc;
        }, {});

        setCellsStatus({
          cells: {
            ...cells,
            ...holesData,
          },
        });
        setGameStatus({ ...gameStatus, status: "loss" });
        return;
      }

      if (grid.settings) {
        const neighboringCells = checkNeighbours(
          index,
          grid.settings.width,
          grid.settings.height
        );

        const amount = getBlackHolesAmount(neighboringCells);

        if (amount === 0) {
          // if a cell has no surrounding black holes do an extra search for each neighbor
          const extraCelsToOpen = getExtraCellsToOpen(neighboringCells);

          setCellsStatus({
            ...cellsStatus,
            cells: {
              ...cells,
              ...extraCelsToOpen,
              [index]: {
                ...current,
                isOpen: true,
                neighboringCells,
                amountNeighboringCellsWithHoles: amount,
              },
            },
          });
        } else {
          setCellsStatus({
            ...cellsStatus,
            cells: {
              ...cells,
              [index]: {
                ...current,
                isOpen: true,
                neighboringCells,
                amountNeighboringCellsWithHoles: amount,
              },
            },
          });
        }
      }
    }
  };

  const handleResetGame = () => {
    setGrid({ list: [] });
    setCellsStatus({ cells: null });
    setGameStatus({ status: "not-started", openCells: 0 });
  };

  const handleResetCells = () => {
    if (grid?.settings) {
      const holesIndexes = generateRandomNumbersArray(
        grid?.settings.holes.length,
        grid.list.length
      );
      const cellsState = getCellsState(grid.list, holesIndexes);
      setGrid({
        list: grid.list,
        settings: { ...grid.settings, holes: holesIndexes },
      });

      setCellsStatus({ cells: cellsState });
      setGameStatus({ status: "not-started", openCells: 0 });
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h2>Proxx</h2>
      </header>

      <main>
        {!grid.settings && <Settings onSubmitForm={handleSubmitSettingsForm} />}
        {grid.list.length > 0 && grid.settings && cellsStatus.cells && (
          <GameBoard
            gridList={grid.list}
            gameStatus={gameStatus.status}
            cells={cellsStatus.cells}
            width={grid.settings.width}
            height={grid.settings.height}
            onDemine={handleDemine}
            onResetGame={handleResetGame}
            onResetCells={handleResetCells}
          />
        )}
      </main>
    </div>
  );
}

export default App;
