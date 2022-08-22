### PROXX


## Explanation

#### Part 1
- Generating an empty array (`width` * `height`), setting up state with this array and all settings.
- Generate an array of particular lengths with random indexes(blackHoles)
- Generating object which represents cells' state(`isOpen`, `isHole`, `amountNeighboringCellsWithHoles`)
- the third state keeps data on the status game and amount of open cells
#### Part 2
- to render the grid we `map` an array of indexes and get cells data from another state (`cellsStatus`)
#### Part 3
- by cell clicking, we open a cell and get the number of neighboring cells with black holes, before that checking if the cell is not the black hole. We also could do this before the first render and have this data immediately in the state.
#### Part 4
- in case a clicked cell has no neighbors with black holes recursive function will automatically make the surrounding cells visible, checking each cell