"use strict";

import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver/SudokuSolver.mjs";

export default class SudokuGenerator {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #solver;

  constructor({ sudokuboard, boxSizeX, boxSizeY }) {
    this.#boxSizeX = boxSizeX || sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = boxSizeY || sudokuboard.boardSize.boxSizeY;

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
      default: () => (isNanN(+level) ? 0.75 : +level),
    };

    const nrOfCell = this.sudokuboard.cells.length;
    const nrOfSetFree = Math.floor(nrOfCell * cellAmmount[level.toLowerCase()]);
    const trialGoal = Math.floor(nrOfCell * 0.24);
    let trialStep = 0;

    let solution;

    const startTime = performance.now();
    do {
      this.#sudokuboard.clearBoard();

      const SampleNr = trialGoal - trialStep;

      [...this.#sudokuboard.cells]
        .sort(() => Math.random() - 0.5)
        .splice(0, SampleNr)
        .forEach((cell) => this.setCellRandomValue(cell));

      trialStep++;
      console.log("trialStep: " + trialStep, "SampleNr: " + SampleNr);

      solution = this.#solver.solvePuzzle({ format: "string", timeOut: 1 });

      [...this.#sudokuboard.cells]
        .sort(() => Math.random() - 0.5)
        .splice(0, nrOfSetFree)
        .forEach((cell) => cell.setValue(0));
    } while (solution === false);

    const endTime = performance.now();
    const generationTime = endTime - startTime;

    console.log(
      "Puzzle generation time: " + generationTime / 1000 + " seconds"
    );

    const puzzle = this.sudokuboard.getCellValues({ format: "string" });
    console.log(level + " puzzle: " + puzzle);
    console.log("solution: " + solution);

    return {
      puzzle,
      solution,
      generationTime,
      trialStep,
      level,
    };
  }
}
