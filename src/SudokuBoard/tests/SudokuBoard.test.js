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
  puzzleFirstCell,
  puzzleX3Y6Cell,
  puzzleStrWithDots,
  firstFreeCell,
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
    caseDesc: "Getting the board values as string, the board is set to puzzle.",
    first: null,
    check: () => board.getCellValues({ format: "1D" }),
    excepted: puzzle1d,
  },
  {
    caseDesc: "Getting the board values as string, the board is set to puzzle.",
    first: null,
    check: () => board.getCellValues({ format: "string" }),
    excepted: puzzleStr,
  },
  {
    caseDesc:
      "Getting the board values as string, and unfilled chars set to '.', the board is set to puzzle.",
    first: null,
    check: () => board.getCellValues({ format: "string", unfilledChar: "." }),
    excepted: puzzleStrWithDots,
  },
  {
    caseDesc: "Getting info of first cell, the board is set to puzzle.",
    first: null,
    check: () => board.getCellByCoords(0, 0).info,
    excepted: puzzleFirstCell,
  },
  {
    caseDesc:
      "Getting getting the info of X3 - Y6 cell, the board is set to puzzle.",
    first: null,
    check: () => board.getCellByCoords(3, 5).info,
    excepted: puzzleX3Y6Cell,
  },
  {
    caseDesc: "Getting the board info, the board is set to puzzle.",
    first: null,
    check: () => board.info,
    excepted: puzzleBoard,
  },
  {
    caseDesc:
      "Finding the first free cell of the board, the board is set to puzzle.",
    first: null,
    check: () => board.getFirstFeeCell().info,
    excepted: firstFreeCell,
  },
  {
    caseDesc:
      "Finding the first free cell of the board and getting the coords of them, the board is set to puzzle.",
    first: null,
    check: () => board.coordsOfFirstFreeCell(),
    excepted: { x: 1, y: 0 },
  },
  {
    caseDesc: "Checking the puzzle is correct, the board is set to puzzle.",
    first: null,
    check: () => board.puzzleIsCorrect(),
    excepted: true,
  },
  {
    caseDesc:
      "Setting the first free cell value to 1 thorug coordinate, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, 1),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 1, issued: true },
  },
  {
    caseDesc:
      "Setting the first free cell value to 0 thorug id selector, checking the value of that.",
    first: () => board.setCellValue({ id: 1 }, 0),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Setting the first free cell value to 2 throug Cell reference, checking the value of that.",
    first: () => board.setCellValue({ cell: board.getFirstFeeCell() }, 1),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 1, issued: true },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: 11, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, 11),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: 'a' string, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, "a"),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: true boolean, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, true),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: true boolean, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, false),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Setting the first free cell value to 1, checking the puzzle is correct, the board is set to puzzle, it must be incorrect!",
    first: () => board.setCellValue({ x: 1, y: 0 }, 1),
    check: () => board.puzzleIsCorrect(),
    excepted: false,
  },
];

batchAssert(cases, {
  showFailed: true,
  showSuccessed: false,
  length: Infinity,
});
