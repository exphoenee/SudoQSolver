"use strict";

/* if it is false the test doesn't will run */
const runTests = true;

/* this is the new solver */
class Solver {
  constructor(boxSizeX, boxSizeY) {
    this.board = new board(boxSizeX, boxSizeY);
  }
}

/* this the class of the sudoku board
  the constructor only gets 2 argument, the x and y size of a box in the board
  therefrom is calculated everything
  this class is only responsible for tha handling, oranazing, setting and getting the status of the cells contained the board.*/
class SudokuBoard {
  /* i used in this case private methods and porperties already */
  #boxSizeX;
  #boxSizeY;
  #dimensionX;
  #dimensionY;
  #cellNumber;
  #maxNumber;
  #cells;
  #rows;
  #cols;
  #boxes;

  constructor(boxSizeX, boxSizeY) {
    this.#boxSizeX = boxSizeX;
    this.#boxSizeY = boxSizeY;
    this.#dimensionX = boxSizeX ** 2;
    this.#dimensionY = boxSizeY ** 2;
    this.#cellNumber = this.#dimensionX * this.#dimensionY;
    this.#maxNumber = this.#boxSizeX * this.#boxSizeY;
    this.#cells = [];
    this.#rows = [];
    this.#cols = [];
    this.#boxes = [];
    this.generateBoard();
  }

  /* This method organizing the cells into rows, columns, and boxes.
  In this calss everything goes by references. */
  generateBoard() {
    this.createCells();
    this.createRows();
    this.createCols();
    this.createBoxes();
  }

  /* Generating all the cells what the board contains. Here is passing down to the cells every information which is beolngs to the cell:
   * x and y coordinate,
   * id of the cell,
   * boxId this is the id of the box, where the cell will placed
   * bx and by coordinate inside the box, maybe that is not neccessary,
   * accepted, what kind of values are accepted:
   ** min is the minimum value
   ** max is the maximum value
   ** unfilled value is that value what means the cell is unfilled
   * given, the cell has an initial value or not
   * issued, the cell has an issue or not */
  createCells() {
    for (let y = 0; y < this.#dimensionY; y++) {
      for (let x = 0; x < this.#dimensionX; x++) {
        const bx = Math.floor(x / this.#boxSizeX);
        const by = Math.floor(y / this.#boxSizeY);
        const cell = new Cell({
          id: x * this.#dimensionX + y,
          x,
          y,
          boxId: this.#boxSizeX * by + bx,
          bx,
          by,
          accepted: {
            unfilled: 0,
            min: 1,
            max: this.#maxNumber,
          },
          given: false,
          issued: false,
        });

        this.#cells.push(cell);
      }
    }
  }

  /* the method returns all the data of the cells what the board including
   that used only for debugging purpose */
  boardProperties() {
    return this.#cells.map((cell) => {
      return {
        x: cell.x,
        y: cell.y,
        id: cell.id,
        boxId: cell.boxId,
        bx: cell.bx,
        by: cell.by,
        value: cell.value,
        given: cell.given,
        issued: cell.issued,
        accepted: cell.accepted,
      };
    });
  }

  /* filtering out the cells, that are in the same column, putting into a Batch, that handle the columns */
  createCols() {
    for (let x = 0; x < this.#dimensionX; x++) {
      const col = new Batch(x);
      this.#cells
        .filter((cell) => cell.x == x)
        .forEach((cell) => col.addCell(cell));
      this.#cols.push(col);
    }
  }

  /* filtering out the cells, that are in the same rows, putting into a Batch, that handle the rows */
  createRows() {
    for (let y = 0; y < this.#dimensionY; y++) {
      const row = new Batch(y);
      this.#cells
        .filter((cell) => cell.y == y)
        .forEach((cell) => row.addCell(cell));
      this.#rows.push(row);
    }
  }

  /* filtering out the cells, that are in the same boxes, putting into a Batch, that handle the boxes */
  createBoxes() {
    for (let boxId = 0; boxId < this.#maxNumber; boxId++) {
      const box = new Batch(boxId);
      this.#cells
        .filter((cell) => cell.boxId == boxId)
        .forEach((cell) => box.addCell(cell));
      this.#boxes.push(box);
    }
  }

  /* gives a row according to the given row number
  arg:    rowNr (Integer)
  return: Batch (Objects) */
  getRow(rowNr) {
    return this.#rows[rowNr];
  }

  /* gives a column according to the given column number
  arg:    colNr (Integer)
  return: Batch (Objects) */
  getCol(colNr) {
    return this.#cols[colNr];
  }

  /* gives a section according to the given section number
  arg:    boxNr (Integer)
  return: Batch (Objects) */
  getBox(boxNr) {
    return this.#boxes[boxNr];
  }

  /* gives a row according to the given row number
  arg:    rowNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getRowValues(rowNr) {
    return this.#rows[rowNr].getCells().map((cell) => cell.value);
  }

  /* gives a column according to the given column number
  arg:    colNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getColValues(colNr) {
    return this.#cols[colNr].getCells().map((cell) => cell.value);
  }

  /* gives a section according to the given section number
  arg:    boxNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getBoxValues(boxNr) {
    return this.#boxes[boxNr].getCells().map((cell) => cell.value);
  }

  /* gives the missing numbers of a row according to the given row number
  arg:    rowNr (Integer)
  return: array of integers that are the possible values what missing from the row  */
  getMissingFromRow(rowNr) {
    return this.getRow(rowNr).getMissingNumbers();
  }

  /* gives into the row already written numbers according to the given row number
  arg:    rowNr (Integer)
  return: array of integers that are the possible values what are in the row already */
  getFilledFromRow(rowNr) {
    return this.getRow(rowNr).getFilledNumbers();
  }

  /* gives the missing numbers of a column according to the given column number
  arg:    column (Integer)
  return: array of integers that are the possible values what missing from the column  */
  getMissingFromCol(colNr) {
    return this.getCol(colNr).getMissingNumbers();
  }

  /* gives into the column already written numbers according to the given column number
  arg:    colNr (Integer)
  return: array of integers that are the possible values what are in the column already */
  getFilledFromCol(colNr) {
    return this.getCol(colNr).getFilledNumbers();
  }

  /* gives the missing numbers of a section according to the given section number
  arg:    boxNr (Integer)
  return: array of integers that are the possible values what missing from the section  */
  getMissingFromBox(boxNr) {
    return this.getBox(boxNr).getMissingNumbers();
  }

  /* gives into the section already written numbers according to the given section number
  arg:    boxNr (Integer)
  return: array of integers that are the possible values what are in the section already */
  getFilledFromBox(boxNr) {
    return this.getBox(boxNr).getFilledNumbers();
  }

  /* this method gives the numbers what can we write into a cell, the cell couldn't has a walue what is represented in the column, the row and the box thath the cell is contained
      arg:      x, y (integer)
      return:   array of integer what is missing form the row, column, and box of the cell */
  getCellPossiblities(x, y) {
    const cell = this.getCellByCoords(x, y);
    const missingFromCol = this.getMissingFromCol(cell.y);
    const missingFromRow = this.getMissingFromRow(cell.x);
    const missingFromBox = this.getMissingFromBox(cell.boxId);

    const intersection = (arr1, arr2) =>
      arr1.filter((value) => arr2.includes(value));

    return intersection(
      intersection(missingFromCol, missingFromRow),
      missingFromBox
    );
  }

  /* checking that the column has duplicates
    arg:    colNr (integers) the column number of the board
    return: true or false that means there are a duplicates for this column */
  hasColumnDuplicates(colNr) {
    return this.getCol(colNr).hasDuplicates();
  }

  /* checking that the row has duplicates
    arg:    rowNr (integers) the row number of the board
    return: true or false that means there are a duplicates for this row */
  hasRowDuplicates(rowNr) {
    return this.getRow(rowNr).hasDuplicates();
  }

  /* checking that the box has duplicates
    arg:    boxNr (integers) the box number of the board
    return: true or false that means there are a duplicates for this box */
  hasBoxDuplicates(boxNr) {
    return this.getBox(boxNr).hasDuplicates();
  }

  /* checking that the cell has duplicates its row, column or section arg:    x, y (integers) the coordinates of the cell
    return: true or false that means there are a duplicates for this cell */
  hasCellDuplicates(x, y) {
    const cell = this.getCellByCoords(x, y);
    return (
      this.hasColumnDuplicates(cell.y) &&
      this.hasRowDuplicates(cell.x) &&
      this.hasBoxDuplicates(cell.boxId)
    );
  }

  /* gives the firs free cell
  arg:    null
  return: Object {x, y} the two coorinate of the cell */
  coordsOfFirstFreeCell() {
    const freeCell = this.#cells.find((cell) => cell.value == 0);
    return { x: freeCell.x, y: freeCell.y };
  }

  /* Validating the coordinate, the coord must be in range between 0 and dimension.
    args:   x, y integers the coords what we would like to validate
    return: true is the coords are in range */
  validateCoord(x, y) {
    return (
      0 <= x && x <= this.#dimensionX - 1 && 0 <= y && y <= this.#dimensionY - 1
    );
  }

  /* gives a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: Cell (Object) */
  getCellByCoords(x, y) {
    if (this.validateCoord(x, y)) {
      return this.#cells.find((cell) => cell.x == x && cell.y == y);
    } else {
      console.error(
        `The x coordinate value must be between 1...${
          this.#dimensionX
        }, the y must be between 1...${
          this.#dimensionY
        }. You asked x: ${x} and y: ${y}.`
      );
    }
  }

  /* setBoard method sets all the cells of the table according to the given arguments.
  arg:    board can be 1D array, 2D array or a string.
  return: void */
  setBoard(board) {
    if (Array.isArray(board)) {
      if (board.length === this.#dimensionY) {
        board.forEach((row, y) => {
          if (board.length === this.#dimensionX) {
            if (Array.isArray(row)) {
              row.forEach((cellValue, x) =>
                this.getCellByCoords(x, y).setValue(cellValue)
              );
            }
          } else {
            console.error(
              `Input array of the setBoard method in case 2D array ${
                this.#dimensionY
              } times ${this.#dimensionX} sized.`
            );
          }
        });
      } else if (board.length === this.#cellNumber) {
        board.forEach((cellValue, nr) => {
          let y = Math.floor(nr / this.#dimensionX);
          let x = nr % this.#dimensionX;
          this.getCellByCoords(x, y).setValue(cellValue);
        });
      } else {
        console.error(
          `Input array of the setBoard method in case of 1D array must be exactly ${
            this.#cellNumber
          } element.`
        );
      }
    } else if (typeof board === "string") {
      if (board.length === this.#cellNumber) {
        board.split("").forEach((cellValue, nr) => {
          let y = Math.floor(nr / this.#dimensionX);
          let x = nr % this.#dimensionX;
          const cell = this.getCellByCoords(x, y);
          if (cell.validateValue(+cellValue)) {
            this.getCellByCoords(x, y).setValue(+cellValue);
          } else {
            cell.setValue(cell.getAccepted().unfilled);
          }
        });
      } else {
        console.error(
          `Input of the setBoard method must be exactly ${
            this.#maxNumber
          } character long string.`
        );
      }
    } else {
      console.error(
        "Input of set setBoard method should be an 1D or 2D array or a string."
      );
    }
  }

  /* gives the values of all the cells in the board
  arg:    object with following keys:
          ** type: (string) can be 1D, 2D, or string, the format of the result
              1D is 1D array, 2D is 2D array, string is string
          ** unfilledChard
  return: 1D, 2D array of integers, or string according to format argument, containig the values of the cells in order they are created */
  getCellValues(params = { format: "1D", unfilledChar: "0" }) {
    const { format, unfilledChar } = params;
    let res = this.#cells.map((cell) => cell.value);
    if (format.toUpperCase() === "STRING") {
      return res.join("").replace(/0/g, unfilledChar);
    } else if (format.toUpperCase() === "2D") {
      const board2D = [];
      while (res.length) board2D.push(res.splice(0, this.#dimensionX));
      return board2D;
    }
    return res;
  }

  /* gives the value of a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: value of the cell (integer) */
  getCellValue(x, y) {
    return this.getCellByCoords(x, y).value;
  }

  /* sets the value of a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: void (undefined) */
  setCellValue(x, y, value) {
    this.getCellByCoords(x, y).setValue(value);
  }
}

/* Class of the Batches, the batches in this concept a bunch of cells, thy can be rows, columns or boxes of the board, this is not matters, because every batch has the same porperties and methods
only one argument required to create a Batch, th ID of them.*/
class Batch {
  #id;
  #cells = [];
  #validValues = [];
  #unfilledValue;
  #minValue;
  #maxValue;

  constructor(id) {
    this.#id = id;
  }

  /* adds a cell into the batch if there is no cell in the batch according to the first cell's acepted property is the valid values array and unfilled value added to the batch
  arg:    Cell (Object)
  return: void (undefined) */
  addCell(cell) {
    const accepted = cell.getAccepted();
    if (this.#cells.length == 0) {
      this.#unfilledValue = accepted.unfilled;
      this.#minValue = accepted.min;
      this.#maxValue = accepted.max;
      this.#validValues = Array.from(
        { length: accepted.max },
        (_, i) => i + accepted.min
      );
    }
    if (
      this.#unfilledValue === accepted.unfilled &&
      this.#minValue === accepted.min &&
      this.#maxValue === accepted.max
    ) {
      this.#cells.push(cell);
    } else {
      console.error(
        "The current cell that would be added has not the same value acceptance as the cells that are already in the batch."
      );
    }
  }

  /* gives all the values of cell they ar in the batch
  arg:   null,
  return arraf of integers, that contains the values of the cells in order the cells are added */
  getCellValues() {
    return this.#cells.map((cell) => cell.value);
  }

  /* gives the missing numbers of the batch
  arg:    null
  return: array of integers that are the possible values what missing from the Batch  */
  getMissingNumbers() {
    return this.#validValues.filter(
      (value) => !this.getCellValues().includes(value)
    );
  }

  /* gives already written of the batch
  arg:    rowNr (Integer)
  return: array of integers that are alerady in the Batch written */
  getFilledNumbers() {
    return this.#validValues.filter((value) =>
      this.getCellValues().includes(value)
    );
  }

  /* checks that the batch has alread a duplicates */
  hasDuplicates() {
    const cellValues = this.getCellValues().filter(
      (cell) => cell !== this.#unfilledValue
    );
    return cellValues.length !== new Set(cellValues).size;
  }

  /* gives the cells, where is the same value written
  arg:    null,
  return: array of cells with the same values */
  getDuplicates() {
    this.getFilledNumbers();
    this.#validValues.map();
  }

  getCellByValue() {}

  /* gives a cell according to the given index
  arg:    i (integer) the index of the cell
  return: Cell (Object) */
  getCellByIndex(i) {
    return this.#cells[i];
  }

  /* gives all the cells they are in the batch
  arg:    null
  return: array of Cell (Object) */
  getCells() {
    return this.#cells;
  }
}

/* this class describes the cell
 * x and y coordinate,
 * id of the cell,
 * boxId this is the id of the box, where the cell will placed
 * bx and by coordinate inside the box, maybe that is not neccessary,
 * accepted, what kind of values are accepted:
 ** min is the minimum value
 ** max is the maximum value
 ** unfilled value is that value what means the cell is unfilled
 * given, the cell has an initial value or not
 * issued, the cell has an issue or not */
class Cell {
  #given;
  #issued;
  #value;
  #x;
  #y;
  #bx;
  #by;
  #id;
  #boxId;
  #accepted;
  constructor({ x, y, bx, by, id, boxId, value, accepted, given, issued }) {
    this.#x = x;
    this.#y = y;
    this.#bx = bx;
    this.#id = id;
    this.#boxId = boxId;
    this.#by = by;
    this.#accepted = accepted;
    this.#value = accepted.unfilled;
    this.#given = given || false;
    this.#issued = issued || false;
  }

  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  get bx() {
    return this.#bx;
  }
  get by() {
    return this.#by;
  }
  get id() {
    return this.#id;
  }
  get boxId() {
    return this.#boxId;
  }
  get value() {
    return this.#value;
  }

  /* Validating the value of a cell
    arg:    value,
    return: true if the value is correct */
  validateValue(value) {
    return (
      (value >= this.#accepted.min && value <= this.#accepted.max) ||
      value === this.#accepted.unfilled
    );
  }

  /* sets and checks the value of a cell if the values is wrong, sets to unfilled
  arg:    newValue (integer)
  retrun: void (undefined) */
  setValue(newValue) {
    if (typeof newValue == "number") {
      if (this.validateValue(newValue)) {
        this.#value = newValue;
      } else {
        this.#value = this.#accepted.unfilled;
        console.error(
          `Valid cell value is between: ${this.#accepted.min} - ${
            this.#accepted.max
          }, value: ${
            this.#accepted.unfilled
          } is allowed for unfilled cells.\nYou tried to set value: ${newValue}, for cell(x=${
            this.#x
          }, y=${this.y}) but value set to: ${
            this.#accepted.unfilled
          }, because of this issue.`
        );
      }
    } else {
      throw new Error("Set value must be a number");
    }
  }

  get given() {
    return this.#given;
  }

  set given(isGiven) {
    if (typeof isGiven == "boolean") {
      this.#given = isGiven;
    } else {
      throw new Error("Set given must be a boolean (true/false)");
    }
  }
  get isIssued() {
    return this.#issued;
  }

  set given(isIssued) {
    if (typeof isIssued == "boolean") {
      this.#issued = isIssued;
    } else {
      throw new Error("Set issued must be a boolean (true/false)");
    }
  }

  /* gives the values what can the cell accept
  arg:    null
  retrun: Object {min, max, unfilled}
    ** min is the minimum value
    ** max is the maximum value
    ** unfilled value is that value what means the cell is unfilled */
  getAccepted() {
    return this.#accepted;
  }
}

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
    resultValue.length > tooLong ? "...too long..." : resultValue
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

if (runTests) {
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
      { x: 0, y: 0, id: 0, boxId: 0, bx: 0, by: 0, value: 2, given: false },
      { x: 1, y: 0, id: 9, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 2, y: 0, id: 18, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 3, y: 0, id: 27, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 4, y: 0, id: 36, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 5, y: 0, id: 45, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 6, y: 0, id: 54, boxId: 2, bx: 2, by: 0, value: 6, given: false },
      { x: 7, y: 0, id: 63, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 8, y: 0, id: 72, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 0, y: 1, id: 1, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 1, y: 1, id: 10, boxId: 0, bx: 0, by: 0, value: 5, given: false },
      { x: 2, y: 1, id: 19, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 3, y: 1, id: 28, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 4, y: 1, id: 37, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 5, y: 1, id: 46, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 6, y: 1, id: 55, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 7, y: 1, id: 64, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 8, y: 1, id: 73, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 0, y: 2, id: 2, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 1, y: 2, id: 11, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 2, y: 2, id: 20, boxId: 0, bx: 0, by: 0, value: 0, given: false },
      { x: 3, y: 2, id: 29, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 4, y: 2, id: 38, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 5, y: 2, id: 47, boxId: 1, bx: 1, by: 0, value: 0, given: false },
      { x: 6, y: 2, id: 56, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 7, y: 2, id: 65, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 8, y: 2, id: 74, boxId: 2, bx: 2, by: 0, value: 0, given: false },
      { x: 0, y: 3, id: 3, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 1, y: 3, id: 12, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 2, y: 3, id: 21, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 3, y: 3, id: 30, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 4, y: 3, id: 39, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 5, y: 3, id: 48, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 6, y: 3, id: 57, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 7, y: 3, id: 66, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 8, y: 3, id: 75, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 0, y: 4, id: 4, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 1, y: 4, id: 13, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 2, y: 4, id: 22, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 3, y: 4, id: 31, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 4, y: 4, id: 40, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 5, y: 4, id: 49, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 6, y: 4, id: 58, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 7, y: 4, id: 67, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 8, y: 4, id: 76, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 0, y: 5, id: 5, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 1, y: 5, id: 14, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 2, y: 5, id: 23, boxId: 3, bx: 0, by: 1, value: 0, given: false },
      { x: 3, y: 5, id: 32, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 4, y: 5, id: 41, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 5, y: 5, id: 50, boxId: 4, bx: 1, by: 1, value: 0, given: false },
      { x: 6, y: 5, id: 59, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 7, y: 5, id: 68, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 8, y: 5, id: 77, boxId: 5, bx: 2, by: 1, value: 0, given: false },
      { x: 0, y: 6, id: 6, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 1, y: 6, id: 15, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 2, y: 6, id: 24, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 3, y: 6, id: 33, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 4, y: 6, id: 42, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 5, y: 6, id: 51, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 6, y: 6, id: 60, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 7, y: 6, id: 69, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 8, y: 6, id: 78, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 0, y: 7, id: 7, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 1, y: 7, id: 16, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 2, y: 7, id: 25, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 3, y: 7, id: 34, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 4, y: 7, id: 43, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 5, y: 7, id: 52, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 6, y: 7, id: 61, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 7, y: 7, id: 70, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 8, y: 7, id: 79, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 0, y: 8, id: 8, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 1, y: 8, id: 17, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 2, y: 8, id: 26, boxId: 6, bx: 0, by: 2, value: 0, given: false },
      { x: 3, y: 8, id: 35, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 4, y: 8, id: 44, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 5, y: 8, id: 53, boxId: 7, bx: 1, by: 2, value: 0, given: false },
      { x: 6, y: 8, id: 62, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 7, y: 8, id: 71, boxId: 8, bx: 2, by: 2, value: 0, given: false },
      { x: 8, y: 8, id: 80, boxId: 8, bx: 2, by: 2, value: 0, given: false },
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
}
