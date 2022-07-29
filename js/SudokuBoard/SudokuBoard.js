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
  listOfCells() {
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
  return: array of Cell (Objects) */
  getRow(rowNr) {
    return this.#rows[rowNr];
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

  /* gives the firs free cell
  arg:    null
  return: Object {x, y} the two coorinate of the cell */
  coordsOfFirstFreeCell() {
    const freeCell = this.#cells.find((cell) => cell.value == 0);
    return { x: freeCell.x, y: freeCell.y };
  }

  /* gives the values of all the cells in the board
  arg:    null
  return: array of integers, the values of the cells in order they are created */
  getCellValues() {
    return this.#cells.map((cell) => cell.value);
  }

  /* gives a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: Cell (Object) */
  getCellByCoords(x, y) {
    return this.#cells.find((cell) => cell.x == x && cell.y == y);
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

  constructor(id) {
    this.#id = id;
  }

  /* adds a cell into the batch
  arg:    Cell (Object)
  return: void (undefined) */
  addCell(cell) {
    if (this.#cells.length == 0) {
      const accepted = cell.getAccepted();
      this.#unfilledValue = accepted.unfilled;
      this.#validValues = Array.from(
        { length: accepted.max },
        (_, i) => i + accepted.min
      );
    }
    this.#cells.push(cell);
  }

  /* gives the missing numbers of the batch
  arg:    null
  return: array of integers that are the possible values what missing from the Batch  */
  getMissingNumbers() {
    const cellValues = this.#cells.map((cell) => cell.value);
    return this.#validValues.filter((value) => !cellValues.includes(value));
  }

  /* gives already written of the batch
  arg:    rowNr (Integer)
  return: array of integers that are alerady in the Batch written */
  getFilledNumbers() {
    const cellValues = this.#cells.map((cell) => cell.value);
    return this.#validValues.filter((value) => cellValues.includes(value));
  }

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

  /* sets and checks the value of a cell if the values is wrong, sets to unfilled
  arg:    newValue (integer)
  retrun: void (undefined) */
  setValue(newValue) {
    if (typeof newValue == "number") {
      if (newValue >= this.#accepted.min && newValue <= this.#accepted.max) {
        this.#value = newValue;
      } else {
        this.#value = this.#accepted.unfilled;
        console.error(
          `Valid cell value is between: ${this.#accepted.min} - ${
            this.#accepted.max
          }, value: ${
            this.#accepted.unfilled
          } is allowed for unfilled cells.\nYou tried to set value: ${newValue}, for cell(x= ${
            this.#x
          },y=${this.y}) but value set to: ${
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

function assert({ first, check, excepted }) {
  const tooLong = 250;
  console.log(
    "--------------------------------TEST STEP--------------------------------"
  );
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

  const decision = `Result:     ${
    resultValue == exceptValue ? `📗ok📗\n` : `📕FAILED📕\n`
  }`;
  console.log(stepText + excepText + resultText + decision);
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
    check: () => board.listOfCells(),
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
}
