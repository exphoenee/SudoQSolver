"use strict";

import assert from "../../../test/assert.mjs";
import Batch from "../Batch.mjs";

const batch = new Batch(4, 3);

//{ first, check, excepted }
const cases = [
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
];

cases.forEach((cs) => assert(cs));
