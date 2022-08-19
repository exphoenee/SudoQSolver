"use strict";

import { batchAssert } from "../../test/assert.mjs";
import SudokuSolver from "../SudokuSolver.mjs";

const solver = new SudokuSolver({ boxSizeX: 3, boxSizeY: 3 });

const cases = [
  {
    caseDesc: "Setting a reference",
    first: null,
    check: () => solver.sudokuboard,
    excepted: 3,
  },
];

batchAssert(cases, { showFailed: true, showSuccessed: false });
