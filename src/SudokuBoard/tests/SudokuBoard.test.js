"use strict";

import { batchAssert } from "../../../test/assert.mjs";
import Batch from "../Batch.mjs";
import Cell from "../../Cell/Cell.mjs";
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
const puzleStr = puzzle1d.join("");
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
    caseDesc: "Getting the id of the batch, batch doesn't has any cell.",
    first: null,
    check: () => batch.id,
    excepted: 4,
  },
];

batchAssert(cases, { showFailed: true, showSuccessed: false });
