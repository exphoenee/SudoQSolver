"use strict";

import SudokuSolver from "../SudokuSolver/SudokuSolver.mjs";

export default class SudokuGenerator {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #puzzle;
  #solver;

  constructor(sudokuboard) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#boxSizeX = sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = sudokuboard.boardSize.boxSizeY;
    this.#puzzle = sudokuboard.getCellValues({ format: "2D" });

    this.#solver = new SudokuSolver(sudokuboard);

    //using the #sudokuboard calss for handling the sudoku board
    this.#sudokuboard = sudokuboard;
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
    const value =
      possibleities[Math.floor(Math.random() * possibleities.length)];
    if (value) cell.setValue(+value);
  }

  setRandomCellToRandomValue() {
    const cell = this.getRandomFreeCell();
    this.setCellRandomValue(cell);
  }

  generateBoard({ level } = { level: "easy" }) {
    const cellAmmount = {
      easy: 0.35,
      medium: 0.4,
      hard: 0.5,
      evil: 0.7,
    };

    const nrOfCell = this.sudokuboard.cells.length;
    const nrOfSetFree = nrOfCell * cellAmmount[level.toLowerCase()];
    const randomize = Math.floor(nrOfSetFree / 2);

    let solution;
    do {
      this.#sudokuboard.clearBoard();
      const cells = [...this.getFreeCells()]
        .sort(() => Math.random() - 0.5)
        .splice(0, nrOfSetFree);

      cells.forEach((cell) => this.setCellRandomValue(cell));
      console.log(cells.map((cell) => cell.value));

      solution = this.#solver.solvePuzzle();
      console.log(solution);
    } while (!solution);
  }
}
