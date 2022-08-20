"use strict";

import { batchAssert } from "../../test/assert.mjs";
import SudokuSolver from "../SudokuSolver.mjs";
import { clearBoardInfo } from "./SudokuSolver.exceptions.mjs";
import {
  claerBoardSolution,
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
} from "../../test/Puzzles.mjs";

const solver = new SudokuSolver(3, 3);

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
    excepted: claerBoardSolution,
  },
  {
    caseDesc: "Setting the eazy puzzle to the board and solving that.",
    first: () => solver.setBoard({ puzzle: puzzle2d }),
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
];

batchAssert(cases, { showFailed: false, showSuccessed: false });
