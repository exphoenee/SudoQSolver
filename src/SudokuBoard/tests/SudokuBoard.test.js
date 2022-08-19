"use strict";

import { batchAssert } from "../../test/assert.mjs";
import {
  clearBoard,
  clearBoardFirstRow,
  clearBoardThirdRow,
  clearBoardAllRows,
  clearBoardFirstCol,
  clearBoardFourthCol,
  clearBoardFirstBox,
  clearBoardSixthBox,
  puzzleBoard,
} from "./SudokuBoard.exceptions.mjs";
import Batch from "../Batch/Batch.mjs";
import Cell from "../Cell/Cell.mjs";
import SudokuBoard from "../SudokuBoard.mjs";

const puzzle2d = [
  [1, 0, 0, 0, 0, 7, 0, 0, 3],
  [9, 0, 6, 0, 0, 8, 2, 0, 4],
  [0, 3, 0, 5, 2, 0, 0, 9, 0],
  [3, 9, 0, 0, 0, 1, 5, 0, 0],
  [0, 0, 5, 0, 0, 0, 9, 0, 0],
  [0, 0, 1, 2, 0, 0, 0, 4, 7],
  [0, 2, 0, 0, 6, 5, 0, 1, 0],
  [5, 0, 8, 1, 0, 0, 7, 0, 2],
  [6, 0, 0, 7, 0, 0, 0, 0, 5],
];
const puzzle1d = puzzle2d.flat();
const puzzleStr = puzzle1d.join("");
const unsolvable2d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 0, 0, 0, 0, 0, 0, 0, 0],
  [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [7, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
];
const unsolvable1d = unsolvable2d.flat();
const unsolvableStr = unsolvable1d.join("");
const wrong2d = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
];
const wrong1d = wrong2d.flat();
const wrongStr = wrong1d.join("");

const board = new SudokuBoard(3, 3);

const cases = [
  {
    caseDesc: "Getting the board properties.",
    first: null,
    check: () => board.info,
    excepted: clearBoard,
  },
  {
    caseDesc: "Getting the first row.",
    first: null,
    check: () => board.getRow(0).info,
    excepted: clearBoardFirstRow,
  },
  {
    caseDesc: "Getting the third row.",
    first: null,
    check: () => board.getRow(2).info,
    excepted: clearBoardThirdRow,
  },
  {
    caseDesc: "Getting all rows.",
    first: null,
    check: () => board.getAllRows().map((row) => row.info),
    excepted: clearBoardAllRows,
  },
  {
    caseDesc: "Getting first column.",
    first: null,
    check: () => board.getCol(0).info,
    excepted: clearBoardFirstCol,
  },
  {
    caseDesc: "Getting fourth column.",
    first: null,
    check: () => board.getCol(3).info,
    excepted: clearBoardFourthCol,
  },
  {
    caseDesc: "Getting first box.",
    first: null,
    check: () => board.getBox(0).info,
    excepted: clearBoardFirstBox,
  },
  {
    caseDesc: "Getting sixt box.",
    first: null,
    check: () => board.getBox(5).info,
    excepted: clearBoardSixthBox,
  },
  {
    caseDesc: "Setting the board to puzzle as 2D array.",
    first: () => board.setBoard(puzzle2d),
    check: () => board.getCellValues({ format: "2D" }),
    excepted: puzzle2d,
  },
  {
    caseDesc: "Setting the board to unsolvable puzzle as 1D array.",
    first: () => board.setBoard(unsolvable1d),
    check: () => board.getCellValues({ format: "2D" }),
    excepted: unsolvable2d,
  },
  {
    caseDesc: "Setting the board to puzzle as string.",
    first: () => board.setBoard(puzzleStr),
    check: () => board.getCellValues({ format: "2D" }),
    excepted: puzzle2d,
  },
  {
    caseDesc: "Getting the board values as string.",
    first: null,
    check: () => board.getCellValues({ format: "1D" }),
    excepted: puzzle1d,
  },
  {
    caseDesc: "Getting the board values as string.",
    first: null,
    check: () => board.getCellValues({ format: "string" }),
    excepted: puzzleStr,
  },
  {
    caseDesc: "Getting the board values as string.",
    first: null,
    check: () => board.getCellByCoords(0, 0).info,
    excepted: {
      id: 0,
      given: false,
      issued: false,
      value: 1,
      x: 0,
      y: 0,
      bx: 0,
      by: 0,
      boxId: 0,
      accepted: { unfilled: 0, min: 1, max: 9 },
    },
  },
  {
    caseDesc: "Getting the board info, the board is set to puzzle.",
    first: null,
    check: () => board.info,
    excepted: puzzleBoard,
  },
];

batchAssert(cases, {
  showFailed: true,
  showSuccessed: false,
  length: Infinity,
});
