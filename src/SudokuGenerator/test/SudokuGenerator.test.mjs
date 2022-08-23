"use strict";

import { batchAssert } from "../../test/assert.mjs";
import SudokuBoard from "../../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../../sudoKuSolver/SudokuSolver.mjs";
import SudokuGenerator from "../SudokuGenerator.mjs";
import { freeCells } from "./SudokuGenerator.exceptions.mjs";

const sudokuboard = new SudokuBoard(3, 3);

const generator = new SudokuGenerator(sudokuboard);

const randomCell = [
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
];

const cases = [
  {
    caseDesc: "Getting a random cell.",
    first: null,
    check: () => randomCell[0],
    excepted: randomCell[0],
  },
  {
    caseDesc: "Getting another random cell.",
    first: null,
    check: () => randomCell[1],
    excepted: randomCell[1],
  },
  {
    caseDesc: "Getting a random cell and setting it to a random value.",
    first: () => generator.setRandomCellToRandomValue(),
    check: () =>
      generator.sudokuboard.cells.filter((cell) => cell.isFilled()).length,
    excepted: 1,
  },
  {
    caseDesc: "Getting another random cell and setting it to a random value.",
    first: () => generator.setRandomCellToRandomValue(),
    check: () =>
      generator.sudokuboard.cells.filter((cell) => cell.isFilled()).length,
    excepted: 2,
  },
  {
    caseDesc:
      "Clearing the board, and setting the first to eigth cell to 1...8 values of all rows.",
    first: () => {
      generator.sudokuboard.clearBoard();
      generator.sudokuboard
        .getAllRows()
        .forEach((row) => row.cells.forEach((cell, i) => cell.setValue(i + 1)));
      for (let y = 1; y < 9; y++)
        generator.sudokuboard.getCellByCoords(8, y).setValue(1);
      generator.sudokuboard.getCellByCoords(8, 0).setValue(0);
    },
    check: () => {
      return [
        generator.sudokuboard.getRowValues(0),
        generator.sudokuboard.getRowValues(3),
        generator.sudokuboard.getRowValues(5),
        generator.sudokuboard.getRowValues(8),
      ];
    },
    excepted: [
      [1, 2, 3, 4, 5, 6, 7, 8, 0],
      [1, 2, 3, 4, 5, 6, 7, 8, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 1],
    ],
  },
  {
    caseDesc:
      "Getting a random free cell (only one is free already) and setting it to a random value (only possible is the 9).",
    first: () => generator.setRandomCellToRandomValue(),
    check: () => generator.sudokuboard.getRowValues(0),
    excepted: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },

  {
    caseDesc: "Generating an evil puzzle.",
    first: () => {
      generator.sudokuboard.clearBoard();
      generator.generateBoard({ level: "easy" });
      console.log("freeCells: ", generator.getFreeCells().length);
      console.log(
        "puzzle: ",
        generator.sudokuboard.getCellValues({ format: "string" })
      );
      const solver = new SudokuSolver(generator.sudokuboard);
      const solution = solver.solvePuzzle({ format: "string" });
      console.log("solution: ", solution);
    },
    check: () => false,
    excepted: true,
  },

  {
    caseDesc: "Generating an evil puzzle.",
    first: () => {
      generator.sudokuboard.clearBoard();
      generator.generateBoard({ level: "medium" });
      console.log("freeCells: ", generator.getFreeCells().length);
      console.log(
        "puzzle: ",
        generator.sudokuboard.getCellValues({ format: "string" })
      );
      const solver = new SudokuSolver(generator.sudokuboard);
      const solution = solver.solvePuzzle({ format: "string" });
      console.log("solution: ", solution);
    },
    check: () => false,
    excepted: true,
  },

  {
    caseDesc: "Generating an evil puzzle.",
    first: () => {
      generator.sudokuboard.clearBoard();
      generator.generateBoard({ level: "hard" });
      console.log("freeCells: ", generator.getFreeCells().length);
      console.log(
        "puzzle: ",
        generator.sudokuboard.getCellValues({ format: "string" })
      );
      const solver = new SudokuSolver(generator.sudokuboard);
      const solution = solver.solvePuzzle({ format: "string" });
      console.log("solution: ", solution);
    },
    check: () => false,
    excepted: true,
  },

  {
    caseDesc: "Generating an evil puzzle.",
    first: () => {
      generator.sudokuboard.clearBoard();
      generator.generateBoard({ level: "evil" });
      console.log("freeCells: ", generator.getFreeCells().length);
      console.log(
        "puzzle: ",
        generator.sudokuboard.getCellValues({ format: "string" })
      );
      const solver = new SudokuSolver(generator.sudokuboard);
      const solution = solver.solvePuzzle({ format: "string" });
      console.log("solution: ", solution);
    },
    check: () => false,
    excepted: true,
  },
];

batchAssert(cases, {
  showFailed: true,
  showSuccessed: false,
  length: 250,
});
