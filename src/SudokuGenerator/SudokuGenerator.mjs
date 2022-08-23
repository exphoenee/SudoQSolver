"use strict";

import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver/SudokuSolver.mjs";

export default class SudokuGenerator {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #solver;

  constructor({ sudokuboard, boxSizeX, boxSizeY }) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#boxSizeX = sudokuboard.boardSize.boxSizeX || boxSizeX;
    this.#boxSizeY = sudokuboard.boardSize.boxSizeY || boxSizeY;

    this.#sudokuboard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
    this.#solver = new SudokuSolver(this.#sudokuboard);
  }

  /* gives back the entire sudokuboard
  arg:    null
  return  SudokuBoard (Object) */
  get sudokuboard() {
    return this.#sudokuboard;
  }

  /* gives back info form all the cells in the board
  arg:    null,
  return: array of object literals */
  setBoard(puzzle) {
    this.#sudokuboard.setBoard(puzzle);
  }

  clearBoard() {
    this.#sudokuboard.clearBoard();
  }

  getFreeCells() {
    return this.#sudokuboard.cells.filter((cell) => cell.isUnfilled());
  }

  getCellPossiblities(cell) {
    return this.#sudokuboard.getCellPossiblities(cell);
  }

  getRandomFreeCell() {
    const freeCells = this.getFreeCells();
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  setCellRandomValue(cell) {
    const possibleities = this.getCellPossiblities({ cell });

    if (possibleities) {
      const value =
        possibleities[Math.floor(Math.random() * possibleities.length)];
      // console.log("pos: " + possibleities, " | val:" + value);
      if (value) cell.setValue(+value);
    }
  }

  setRandomCellToRandomValue() {
    const cell = this.getRandomFreeCell();
    this.setCellRandomValue(cell);
  }

  generateBoard({ level } = { level: "easy" }) {
    const cellAmmount = {
      easy: 0.75,
      medium: 0.65,
      hard: 0.45,
      evil: 0.4,
    };

    const nrOfCell = this.sudokuboard.cells.length;
    const nrOfSetFree = Math.floor(nrOfCell * cellAmmount[level.toLowerCase()]);
    let trial = Math.floor(nrOfSetFree * 0.6);

    let solution;

    const startTime = performance.now();
    do {
      this.#sudokuboard.clearBoard();

      const cells = [...this.#sudokuboard.cells]
        .sort(() => Math.random() - 0.5)
        .splice(0, trial);

      cells.forEach((cell) => this.setCellRandomValue(cell));

      solution = this.#solver.solvePuzzle({ format: "string" });

      const cellsForFreeUp = [...this.#sudokuboard.cells]
        .sort(() => Math.random() - 0.5)
        .splice(0, nrOfSetFree);

      cellsForFreeUp.forEach((cell) => cell.setValue(0));

      trial -= 2;
      console.log("| trial", trial);

      /*       cells.forEach((cell) => this.sudokuboard.setCellValue({ cell }, 0));
      console.log(
        "random valuess: ",
        cells.map((cell) => "id: " + cell.id + "->" + cell.value)
        );
        console.log("solution: ", solution); */
    } while (solution === false);

    const endTime = performance.now();
    console.log(
      `Call to puzzle generation took ${(endTime - startTime) / 1000} seconds`
    );

    return this.sudokuboard.getCellValues({ format: "string" });
  }
}
