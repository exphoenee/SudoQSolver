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
  puzzleIssuedCells,
  furtherIssuedCells,
  secondFreeCell,
  dupsInFirstRow,
  dupsInSecondRow,
  dupsInFirstCol,
  dupsInSecondCol,
  dupsInFirstBox,
  dupsInSecondBox,
} from "./SudokuBoard.exceptions.mjs";
import Batch from "../Batch/Batch.mjs";
import Cell from "../Cell/Cell.mjs";
import SudokuBoard from "../SudokuBoard.mjs";
import {
  puzzle2d,
  puzzle1d,
  puzzleStr,
  unsolvable2d,
  unsolvable1d,
  unsolvableStr,
  wrong2d,
  wrong1d,
  wrongStr,
} from "../../Model/Puzzles.mjs";

const board = new SudokuBoard(3, 3);
board.setBoard(puzzle1d);
console.log(board.getCellValues({ format: "string" }));

const board2 = new SudokuBoard(3, 3, puzzle1d);
console.log(board2.getCellValues({ format: "string" }));

const board3 = new SudokuBoard(3, 3);
board3.setBoard(puzzle1d);
console.log(board3.getCellValues({ format: "string" }));
