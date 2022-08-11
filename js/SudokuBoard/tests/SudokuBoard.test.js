"use strict";

const SudokuBoard = require("../SudokuBoard");
const board = new SudokuBoard(3, 3);

/******************************************/
/*                 tests                  */
/******************************************/
let tests = 0;
let failed = 0;
function assert({ first, check, excepted }) {
  tests++;
  const tooLong = 250;
  let stepText = "";
  if (first) {
    const firstResult = first();
    const firstValue = JSON.stringify(firstResult);
    stepText = `Called first: ${first}, returned: ${firstValue}\n`;
  }

  const exceptValue = JSON.stringify(excepted);
  const excepText = `Exceptation is: ${
    exceptValue.length > tooLong ? "...too long..." : exceptValue
  }\n`;

  const res = check();
  const resultValue = JSON.stringify(res);
  const resultText = `Then called: ${check}, returned: ${
    resultValue && resultValue.length > tooLong ? "...too long..." : resultValue
  }\n`;

  const testResult = resultValue == exceptValue;

  const decision = `Result:     ${
    resultValue == exceptValue ? `📗ok📗\n` : `📕FAILED📕\n`
  }`;
  !testResult && failed++;

  console.warn(
    `----------------------TEST STEP: ${tests} Failed: ${failed}----------------`
  );
  console.warn(stepText + excepText + resultText + decision);
}

if (true) {
  assert({
    check: () => board.getCellValue(1, 1),
    excepted: 0,
  });
  assert({
    first: () => board.setCellValue(1, 1, 100),
    check: () => board.getCellValue(1, 1),
    excepted: 0,
  });
  assert({
    first: () => board.setCellValue(1, 1, 5),
    check: () => board.getCellValue(1, 1),
    excepted: 5,
  });
  assert({
    first: () => board.setCellValue(0, 0, 2),
    check: () => board.getMissingFromRow(0),
    excepted: [1, 3, 4, 5, 6, 7, 8, 9],
  });
  assert({
    first: () => board.setCellValue(6, 0, 6),
    check: () => board.getFilledFromRow(0),
    excepted: [2, 6],
  });
  assert({
    check: () => board.getCellValues(),
    excepted: [
      2, 0, 0, 0, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ],
  });
  assert({
    check: () => board.coordsOfFirstFreeCell(),
    excepted: { x: 1, y: 0 },
  });
  assert({
    check: () => board.boardProperties(),
    excepted: [
      {
        id: 0,
        given: false,
        issued: false,
        value: 2,
        x: 0,
        y: 0,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 9,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 0,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 18,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 0,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 27,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 0,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 36,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 0,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 45,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 0,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 54,
        given: false,
        issued: false,
        value: 6,
        x: 6,
        y: 0,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 63,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 0,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 72,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 0,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 1,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 1,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 10,
        given: false,
        issued: false,
        value: 5,
        x: 1,
        y: 1,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 19,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 1,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 28,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 1,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 37,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 1,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 46,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 1,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 55,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 1,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 64,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 1,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 73,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 1,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 2,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 2,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 11,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 2,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 20,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 2,
        bx: 0,
        by: 0,
        boxId: 0,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 29,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 2,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 38,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 2,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 47,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 2,
        bx: 1,
        by: 0,
        boxId: 1,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 56,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 2,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 65,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 2,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 74,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 2,
        bx: 2,
        by: 0,
        boxId: 2,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 3,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 3,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 12,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 3,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 21,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 3,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 30,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 3,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 39,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 3,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 48,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 3,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 57,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 3,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 66,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 3,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 75,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 3,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 4,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 4,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 13,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 4,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 22,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 4,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 31,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 4,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 40,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 4,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 49,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 4,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 58,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 4,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 67,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 4,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 76,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 4,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 5,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 5,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 14,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 5,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 23,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 5,
        bx: 0,
        by: 1,
        boxId: 3,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 32,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 5,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 41,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 5,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 50,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 5,
        bx: 1,
        by: 1,
        boxId: 4,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 59,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 5,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 68,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 5,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 77,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 5,
        bx: 2,
        by: 1,
        boxId: 5,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 6,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 6,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 15,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 6,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 24,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 6,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 33,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 6,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 42,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 6,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 51,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 6,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 60,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 6,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 69,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 6,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 78,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 6,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 7,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 7,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 16,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 7,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 25,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 7,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 34,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 7,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 43,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 7,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 52,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 7,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 61,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 7,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 70,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 7,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 79,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 7,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 8,
        given: false,
        issued: false,
        value: 0,
        x: 0,
        y: 8,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 17,
        given: false,
        issued: false,
        value: 0,
        x: 1,
        y: 8,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 26,
        given: false,
        issued: false,
        value: 0,
        x: 2,
        y: 8,
        bx: 0,
        by: 2,
        boxId: 6,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 35,
        given: false,
        issued: false,
        value: 0,
        x: 3,
        y: 8,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 44,
        given: false,
        issued: false,
        value: 0,
        x: 4,
        y: 8,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 53,
        given: false,
        issued: false,
        value: 0,
        x: 5,
        y: 8,
        bx: 1,
        by: 2,
        boxId: 7,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 62,
        given: false,
        issued: false,
        value: 0,
        x: 6,
        y: 8,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 71,
        given: false,
        issued: false,
        value: 0,
        x: 7,
        y: 8,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
      {
        id: 80,
        given: false,
        issued: false,
        value: 0,
        x: 8,
        y: 8,
        bx: 2,
        by: 2,
        boxId: 8,
        accepted: { unfilled: 0, min: 1, max: 9 },
      },
    ],
  });
  assert({
    check: () => board.getCellValues({ format: "string", unfilledChar: "." }),
    excepted:
      "2.....6...5......................................................................",
  });
  assert({
    first: () =>
      board.setBoard([
        [2, 1, 3, 0, 0, 0, 6, 0, 0],
        [0, 5, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]),
    check: () => board.getCellValues({ format: "string", unfilledChar: "." }),
    excepted:
      "213...6...5......................................................................",
  });
  assert({
    first: () =>
      board.setBoard([
        2, 5, 6, 0, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
    check: () => board.getCellValues({ format: "string", unfilledChar: "." }),
    excepted:
      "256...6...5......................................................................",
  });
  assert({
    first: () =>
      board.setBoard(
        "25698761235......................................................................"
      ),
    check: () => board.getCellValues({ format: "string", unfilledChar: "." }),
    excepted:
      "25698761235......................................................................",
  });
  assert({
    check: () => board.getCellValues({ format: "2D", unfilledChar: "." }),
    excepted: [
      [2, 5, 6, 9, 8, 7, 6, 1, 2],
      [3, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  });
  assert({
    check: () => board.getRowValues(0),
    excepted: [2, 5, 6, 9, 8, 7, 6, 1, 2],
  });
  assert({
    check: () => board.getColValues(0),
    excepted: [2, 3, 0, 0, 0, 0, 0, 0, 0],
  });
  assert({
    check: () => board.getBoxValues(0),
    excepted: [2, 5, 6, 3, 5, 0, 0, 0, 0],
  });
  assert({
    first: () => board.getRowValues(0),
    check: () => board.hasRowDuplicates(0),
    excepted: true,
  });
  assert({
    first: () => board.getRowValues(1),
    check: () => board.hasRowDuplicates(1),
    excepted: false,
  });
  assert({
    first: () => board.getColValues(0),
    check: () => board.hasColumnDuplicates(0),
    excepted: false,
  });
  assert({
    first: () => board.getColValues(1),
    check: () => board.hasColumnDuplicates(1),
    excepted: true,
  });
  assert({
    first: () => board.getBoxValues(0),
    check: () => board.hasBoxDuplicates(0),
    excepted: true,
  });
  assert({
    first: () => board.getBoxValues(1),
    check: () => board.hasBoxDuplicates(1),
    excepted: false,
  });
  assert({
    first: () => board.getRowValues(0),
    check: () => board.getRow(0).getDuplicateValues(),
    excepted: [6, 2],
  });
  assert({
    first: () => board.getRowValues(0),
    check: () =>
      board
        .getRow(0)
        .getDuplicateValuedCells()
        .map((cell) => {
          return { id: cell.id, value: cell.value };
        }),
    excepted: [
      { id: 0, value: 2 },
      { id: 18, value: 6 },
      { id: 54, value: 6 },
      { id: 72, value: 2 },
    ],
  });
  assert({
    first: () => board.getRow(0).setIssued(),
    check: () =>
      board
        .getRow(0)
        .getDuplicateValuedCells()
        .map((cell) => {
          return { id: cell.id, value: cell.value, issued: cell.isIssued };
        }),
    excepted: [
      { id: 0, value: 2, issued: true },
      { id: 18, value: 6, issued: true },
      { id: 54, value: 6, issued: true },
      { id: 72, value: 2, issued: true },
    ],
  });
  assert({
    first: () => board.getRow(0).clearIssued(),
    check: () =>
      board
        .getRow(0)
        .getDuplicateValuedCells()
        .map((cell) => {
          return { id: cell.id, value: cell.value, issued: cell.isIssued };
        }),
    excepted: [
      { id: 0, value: 2, issued: false },
      { id: 18, value: 6, issued: false },
      { id: 54, value: 6, issued: false },
      { id: 72, value: 2, issued: false },
    ],
  });
  assert({
    first: () => {
      board.getRow(0).setIssued();
      board.clearIssued();
    },
    check: () =>
      board
        .getRow(0)
        .getDuplicateValuedCells()
        .map((cell) => {
          return { id: cell.id, value: cell.value, issued: cell.isIssued };
        }),
    excepted: [
      { id: 0, value: 2, issued: false },
      { id: 18, value: 6, issued: false },
      { id: 54, value: 6, issued: false },
      { id: 72, value: 2, issued: false },
    ],
  });
}
