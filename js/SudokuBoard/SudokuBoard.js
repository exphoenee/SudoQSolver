"use strict";
/* this is the new solver */
/*
class Solver {
  constructor(boxSizeX, boxSizeY) {
    this.board = new board(boxSizeX, boxSizeY);
  }
}
*/

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

  constructor(boxSizeX, boxSizeY, puzzle = null) {
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
    puzzle && this.setBoard(puzzle);
    return this;
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
    if (this.#cells.length <= this.#cellNumber) {
      for (let y = 0; y < this.#dimensionY; y++) {
        for (let x = 0; x < this.#dimensionX; x++) {
          const bx = Math.floor(x / this.#boxSizeX);
          const by = Math.floor(y / this.#boxSizeY);
          const cell = new Cell({
            id: y * this.#dimensionX + x,
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
    } else {
      throw new Error(
        `Something went wrong, only number of ${
          this.#cellNumber
        } cells allowed you tried to create the +1.`
      );
    }
  }

  /* the method returns all the data of the cells what the board including
   that used only for debugging purpose */
  boardProperties() {
    return this.#cells.map((cell) => cell.getInfo());
  }

  clearIssued() {
    this.#cells.forEach((cell) => cell.setUnIssued());
  }

  /* filtering out the cells, that are in the same column, putting into a Batch, that handle the columns */
  createCols() {
    for (let x = 0; x < this.#dimensionX; x++) {
      const col = new Batch(x, this.#dimensionX);
      this.#cells
        .filter((cell) => cell.x == x)
        .forEach((cell) => col.addCell(cell));
      this.#cols.push(col);
    }
    if (this.#cols.length !== this.#dimensionX)
      throw new Error(
        `There is more columns (${this.#cols.length}) then allowed (${
          this.#dimensionX
        }).`
      );
  }

  /* filtering out the cells, that are in the same rows, putting into a Batch, that handle the rows */
  createRows() {
    for (let y = 0; y < this.#dimensionY; y++) {
      const row = new Batch(y, this.#dimensionY);
      this.#cells
        .filter((cell) => cell.y == y)
        .forEach((cell) => row.addCell(cell));
      this.#rows.push(row);
    }
    if (this.#rows.length !== this.#dimensionY)
      throw new Error(
        `There is more rows (${this.#rows.length}) then allowed (${
          this.#dimensionY
        }).`
      );
  }

  /* filtering out the cells, that are in the same boxes, putting into a Batch, that handle the boxes */
  createBoxes() {
    for (let boxId = 0; boxId < this.#maxNumber; boxId++) {
      const box = new Batch(boxId, this.#maxNumber);
      this.#cells
        .filter((cell) => cell.boxId == boxId)
        .forEach((cell) => box.addCell(cell));
      this.#boxes.push(box);
    }
    if (this.#boxes.length !== this.#maxNumber)
      throw new Error(
        `There is more boxes (${this.#boxes.length}) then allowed (${
          this.#maxNumber
        }).`
      );
  }

  /* gives a row according to the given row number
  arg:    rowNr (Integer)
  return: Batch (Objects) */
  getRow(rowNr) {
    return this.#rows[rowNr];
  }

  /* gives all rows in a 2D array
  arg:    rowNr (Integer)
  return: 1D array of Batch (Objects) */
  getAllRows() {
    return this.#rows;
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
    return this.getRow(rowNr)
      .getCells()
      .map((cell) => cell.value);
  }

  /* gives a column according to the given column number
  arg:    colNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getColValues(colNr) {
    return this.getCol(colNr)
      .getCells()
      .map((cell) => cell.value);
  }

  /* gives a section according to the given section number
  arg:    boxNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getBoxValues(boxNr) {
    return this.getBox(boxNr)
      .getCells()
      .map((cell) => cell.value);
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
  getCellPossiblities({ x, y, cell }) {
    if (!cell) cell = this.getCellByCoords(x, y);
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

  puzzleIsCorrect() {
    [...this.#rows, ...this.#cols, ...this.#boxes].forEach((batch) => {
      if (batch.hasDuplicates()) return false;
    });
    return true;
  }

  /* gives the first free cell
    arg:    null
    return: Cell (Object) */
  getFirstFeeCell() {
    const freeCell = this.#cells.find((cell) => cell.value == 0);
    if (freeCell) return freeCell;
    return false;
  }

  /* gives the coords of the first free cell
    arg:    null
    return: Object {x, y} the two coorinate of the cell */
  coordsOfFirstFreeCell() {
    const freeCell = this.getFirsrFeeCell();
    if (freeCell) return { x: freeCell.x, y: freeCell.y };
    return false;
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
    return this;
  }

  /* gives the values of all the cells in the board
  arg:    null
  return: 1D of Cells (Object) */
  get cells() {
    return this.#cells;
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
  #cellNumber;

  constructor(id, cellNumber) {
    this.#id = id;
    this.#cellNumber = cellNumber;
  }

  set id(id) {
    this.#id = id;
  }

  get id() {
    return this.#id;
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

    if (this.#cells.length >= this.#cellNumber)
      throw new Error(
        `There is more cells in this batch (${
          this.#cells.length
        }) then allowed (${this.#cellNumber}).`
      );
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
  return: array of cells (object) with the same values */
  getDuplicateValuedCells() {
    return this.#cells.filter((cell) =>
      this.getDuplicateValues().includes(cell.value)
    );
  }

  /* sets the duplicate valued cells to issued
  arg:    null,
  return: null. */
  setIssued() {
    this.getDuplicateValuedCells().forEach((cell) => cell.setIssued());
  }

  /* removing the issued tag form the all the cells of the batch */
  clearIssued() {
    this.#cells.forEach((cell) => cell.setUnIssued());
  }

  /* gives the values, what is the duplicated in the batch
  arg:    null,
  return: array of (integers)  */
  getDuplicateValues() {
    if (this.hasDuplicates()) {
      const nums = this.getCellValues();
      return nums.filter((item, index) => nums.indexOf(item) !== index);
    }
  }

  /* gives all the cells with the given value
  arg:    value (integer),
  return: array of Cells (object) */
  getCellByValue(value) {
    return this.#cells.filter((cell) => cell.value === value);
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
  #ref;

  constructor({
    x,
    y,
    bx,
    by,
    id,
    boxId,
    value,
    accepted,
    given,
    issued,
    ref,
  }) {
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
    this.#ref = ref || null;
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

  /* gives all the properties of a cell for debuging purpose made */
  getInfo() {
    return {
      id: this.#id,
      given: this.#given,
      issued: this.#issued,
      value: this.#value,
      x: this.#x,
      y: this.#y,
      bx: this.#bx,
      by: this.#by,
      id: this.#id,
      boxId: this.#boxId,
      accepted: this.#accepted,
    };
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

  /* sets a cell to given state, that means it coouldn't be changed by the user
    arg:     boolean
    returns: undefined */
  setGiven(isGiven) {
    if (typeof isGiven == "boolean") {
      this.#given = isGiven;
    } else {
      throw new Error("Set given must be a boolean (true/false)");
    }
  }

  /* gives back the cell issued state */
  get isIssued() {
    return this.#issued;
  }

  /* sets the cell to issued state */
  setIssued() {
    this.#issued = true;
  }

  /* sets the cell to unissued state */
  setUnIssued() {
    this.#issued = false;
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

  isFilled() {
    return this.value !== this.getAccepted().unfilled;
  }

  isUnfilled() {
    return this.#value === this.#accepted.unfilled;
  }

  getRef() {
    return this.#ref;
  }
  setRef(ref) {
    this.#ref = ref;
  }
}
