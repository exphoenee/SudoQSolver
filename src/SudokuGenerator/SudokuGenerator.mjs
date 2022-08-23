"use strict";

import SudokuSolver from "../SudokuGenerator/SudokuSolver.mjs";

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
      easy: 0.5,
      medium: 0.6,
      hard: 0.7,
      evil: 0.8,
    };

    for (let i = 0; i < 6; i++) {
      setRandomCellToRandomValue();
    }

    const solution = this.#solver.solvePuzzle();
    console.log(solution);
  }
}
