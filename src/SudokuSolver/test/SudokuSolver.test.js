"use strict";

import { batchAssert } from "../../test/assert.mjs";
import SudokuSolver from "../SudokuSolver.mjs";
import SudokuBoard from "../../SudokuBoard/SudokuBoard.mjs";
import { clearBoardInfo } from "./SudokuSolver.exceptions.mjs";
import {
  claerBoardSolution1,
  claerBoardSolution2,
  puzzle2d,
  puzzle1d,
  puzzleStr,
  puzzleSolution,
  unsolvable2d,
  unsolvable1d,
  unsolvableStr,
  wrong2d,
  wrong1d,
  wrongStr,
} from "../../Model/3x3_Puzzles.mjs";

const sudokuboard = new SudokuBoard(3, 3);
const solver = new SudokuSolver(sudokuboard);

const cases = [
  {
    caseDesc: "Getting the board information of the clear board.",
    first: null,
    check: () => solver.sudokuboard.info,
    excepted: clearBoardInfo,
  },
  {
    caseDesc: "Solving the clear board.",
    first: null,
    check: () => solver.solvePuzzle(),
    excepted: claerBoardSolution2,
  },
  {
    caseDesc: "Setting the eazy puzzle to the board and solving that.",
    first: () => solver.setBoard(puzzle2d),
    check: () => solver.solvePuzzle(),
    excepted: puzzleSolution,
  },
  {
    caseDesc: "Clearing the board, and solving the easy puzzle.",
    first: () => solver.clearBoard(),
    check: () => solver.solvePuzzle({ puzzle: puzzle2d }),
    excepted: puzzleSolution,
  },
  {
    caseDesc:
      "Clearing the board, and solving the easy puzzle, gets the format in 1D array.",
    first: () => solver.clearBoard(),
    check: () => solver.solvePuzzle({ puzzle: puzzle2d, format: "1D" }),
    excepted: puzzleSolution.flat(),
  },
  {
    caseDesc:
      "Clearing the board, and solving the easy puzzle, gets the format in 1D array.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle2d, "1D"),
    excepted: puzzle2d.flat(),
  },
  {
    caseDesc: "Convert easy puzzle 2D to 2D.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle2d, "2D"),
    excepted: puzzle2d,
  },
  {
    caseDesc: "Convert easy puzzle 2D to 1D.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle2d, "1D"),
    excepted: puzzle1d,
  },
  {
    caseDesc: "Convert easy puzzle 2D to string.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle2d, "string"),
    excepted: puzzleStr,
  },
  {
    caseDesc: "Convert easy puzzle 2D to string replacing the '0' to '.'.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle2d, "string", "."),
    excepted: puzzleStr.replace(/0/g, "."),
  },
  {
    caseDesc: "Convert easy puzzle 1D to 1D.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle1d, "1D"),
    excepted: puzzle1d,
  },
  {
    caseDesc: "Convert easy puzzle 1D to 2D.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle1d, "2D"),
    excepted: puzzle2d,
  },
  {
    caseDesc: "Convert easy puzzle 1D to string.",
    first: () => solver.clearBoard(),
    check: () => solver.convertPuzzle(puzzle1d, "string"),
    excepted: puzzleStr,
  },
  {
    caseDesc:
      "Setting the eazy puzzle to the board as 2D array and trying to solve that under 1 ms.",
    first: () => solver.setBoard(puzzle2d),
    check: () => solver.solvePuzzle({ timeOut: 1 }),
    excepted: false,
  },
  {
    caseDesc:
      "Setting the eazy puzzle to the board as 2D array and trying to solve that under 5000 ms.",
    first: () => solver.setBoard(puzzle2d),
    check: () => solver.solvePuzzle({ timeOut: 5000 }),
    excepted: puzzleSolution,
  },
];

batchAssert(cases, { showFailed: true, showSuccessed: false });
