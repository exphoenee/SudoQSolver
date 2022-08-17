"use strict";

import assert from "../../../test/assert.mjs";
import Batch from "../Batch.mjs";
import Cell from "../../Cell/Cell.mjs";

const cell1 = new Cell({
  x: 0,
  y: 0,
  bx: 0,
  by: 0,
  id: 0,
  boxId: 0,
  value: 0,
  accepted: { max: 9, min: 1, unfilled: 0 },
  given: false,
  issued: false,
  ref: null,
});
const cell2 = new Cell({
  x: 1,
  y: 0,
  bx: 0,
  by: 0,
  id: 0,
  boxId: 1,
  value: 0,
  accepted: { max: 9, min: 1, unfilled: 0 },
  given: false,
  issued: false,
  ref: null,
});
const cell3 = new Cell({
  x: 2,
  y: 0,
  bx: 0,
  by: 0,
  id: 0,
  boxId: 2,
  value: 0,
  accepted: { max: 9, min: 1, unfilled: 0 },
  given: false,
  issued: false,
  ref: null,
});

const batch = new Batch(4, 3);

//{ first, check, excepted }
const cases = [
  /* Testing without a cell */
  {
    caseDesc: "Getting the id of the batch.",
    first: null,
    check: () => batch.id,
    excepted: 4,
  },
  {
    caseDesc: "Getting the cell values of the batch.",
    first: null,
    check: () => batch.getCellValues(),
    excepted: [],
  },
  {
    caseDesc: "Getting the cell missing values of the batch.",
    first: null,
    check: () => batch.getMissingNumbers(),
    excepted: [],
  },
  {
    caseDesc: "Getting the cell filled values of the batch.",
    first: null,
    check: () => batch.getFilledNumbers(),
    excepted: [],
  },
  {
    caseDesc: "Has the batch diplicates?",
    first: null,
    check: () => batch.hasDuplicates(),
    excepted: false,
  },
  {
    caseDesc: "Get the cells of batch with diplicated values.",
    first: null,
    check: () => batch.getDuplicateValuedCells(),
    excepted: [],
  },
  {
    caseDesc: "Get the batch diplicated values.",
    first: null,
    check: () => batch.getDuplicateValues(),
    excepted: [],
  },
  {
    caseDesc: "Get the a cell with value 1.",
    first: null,
    check: () => batch.getCellByValue(1),
    excepted: [],
  },
  {
    caseDesc: "Get the a cell with index 1.",
    first: null,
    check: () => batch.getCellByIndex(1),
    excepted: undefined,
  },
  {
    caseDesc: "Get the a cell of the batch.",
    first: null,
    check: () => batch.getCells(),
    excepted: [],
  },
  {
    caseDesc: "Get the a issued cell of the batch.",
    first: () => batch.findAndSetIssued(),
    check: () => batch.getIssuedCells(),
    excepted: [],
  },
  {
    caseDesc: "Clears the a issued porperty of all cell of the batch.",
    first: () => batch.clearIssued(),
    check: () => batch.getIssuedCells(),
    excepted: undefined,
  },
  /************************************/
  /* Adding a cell, for further tests */
  /************************************/
  {
    caseDesc: "Adding the first cell nad getting the valeus of the batch.",
    first: () => batch.addCell(cell1),
    check: () => batch.getCellValues(),
    excepted: [0],
  },
  {
    caseDesc:
      "Changing the first cell value to 3 and getting the values of the batch.",
    first: () => cell1.setValue(3),
    check: () => batch.getCellValues(),
    excepted: [3],
  },
  {
    caseDesc: "Getting the missing values of the batch.",
    first: null,
    check: () => batch.getMissingNumbers(),
    excepted: [1, 2, 4, 5, 6, 7, 8, 9],
  },
  {
    caseDesc: "Getting the filled values of the batch.",
    first: null,
    check: () => batch.getFilledNumbers(),
    excepted: [3],
  },
  {
    caseDesc:
      "Changing the value of first cell to 4 and getting the missing values of the batch.",
    first: () => cell1.setValue(4),
    check: () => batch.getMissingNumbers(),
    excepted: [1, 2, 3, 5, 6, 7, 8, 9],
  },
  {
    caseDesc: "Getting the filled values of the batch.",
    first: null,
    check: () => batch.getFilledNumbers(),
    excepted: [4],
  },
  {
    caseDesc: "Has the batch diplicates?",
    first: null,
    check: () => batch.hasDuplicates(),
    excepted: false,
  },
  {
    caseDesc: "Get the cells of batch with diplicated values.",
    first: null,
    check: () => batch.getDuplicateValuedCells(),
    excepted: [],
  },
  {
    caseDesc: "Get the batch diplicated values.",
    first: null,
    check: () => batch.getDuplicateValues(),
    excepted: [],
  },
  {
    caseDesc: "Get the a cell with value 4.",
    first: null,
    check: () => batch.getCellByValue(4),
    excepted: [{}],
  },
  {
    caseDesc: "Get the a cell with index 0.",
    first: null,
    check: () => batch.getCellByIndex(0),
    excepted: {},
  },
  {
    caseDesc: "Get the a cell of the batch.",
    first: null,
    check: () => batch.getCells(),
    excepted: [{}],
  },
  {
    caseDesc: "Get the a issued cell of the batch.",
    first: () => batch.findAndSetIssued(),
    check: () => batch.getIssuedCells(),
    excepted: [],
  },
  {
    caseDesc: "Clears the a issued porperty of all cell of the batch.",
    first: () => batch.clearIssued(),
    check: () => batch.getIssuedCells(),
    excepted: undefined,
  },
  /*************************************/
  /* Adding a second cell to the batch */
  /*************************************/
  {
    caseDesc: "Adding the first cell nad getting the valeus of the batch.",
    first: () => batch.addCell(cell2),
    check: () => batch.getCellValues(),
    excepted: [4, 0],
  },
  {
    caseDesc:
      "Changing the first cell value to 3 and getting the values of the batch.",
    first: () => cell2.setValue(3),
    check: () => batch.getCellValues(),
    excepted: [4, 3],
  },
  {
    caseDesc: "Getting the missing values of the batch.",
    first: null,
    check: () => batch.getMissingNumbers(),
    excepted: [1, 2, 5, 6, 7, 8, 9],
  },
  {
    caseDesc: "Getting the filled values of the batch.",
    first: null,
    check: () => batch.getFilledNumbers(),
    excepted: [3, 4],
  },
  {
    caseDesc: "Has the batch diplicates?",
    first: null,
    check: () => batch.hasDuplicates(),
    excepted: false,
  },
  {
    caseDesc:
      "Set cell 1 same value as cell 2 has, and checks: has the batch diplicates?",
    first: () => cell1.setValue(cell2.value),
    check: () => batch.hasDuplicates(),
    excepted: true,
  },
  {
    caseDesc: "Get the cells of batch with diplicated values.",
    first: null,
    check: () => batch.getDuplicateValuedCells(),
    excepted: [{}, {}],
  },
  {
    caseDesc: "Get the batch diplicated values.",
    first: null,
    check: () => batch.getDuplicateValues(),
    excepted: [3],
  },
  {
    caseDesc: "Get the a cell with value 3.",
    first: null,
    check: () => batch.getCellByValue(3),
    excepted: [{}, {}],
  },
  {
    caseDesc: "Get the a cell with index 1.",
    first: null,
    check: () => batch.getCellByIndex(1),
    excepted: {},
  },
  {
    caseDesc: "Get the a cell of the batch.",
    first: null,
    check: () => batch.getCells(),
    excepted: [{}, {}],
  },
  {
    caseDesc: "Get the a issued cell of the batch.",
    first: () => batch.findAndSetIssued(),
    check: () => batch.getIssuedCells(),
    excepted: [{}, {}],
  },
  {
    caseDesc: "Clears the a issued porperty of all cell of the batch.",
    first: () => batch.clearIssued(),
    check: () => batch.getIssuedCells(),
    excepted: undefined,
  },
];

cases.forEach((cs) => assert(cs));
