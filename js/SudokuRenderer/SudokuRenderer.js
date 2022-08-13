"use strict";

class SudokuRenderer {
  #sudokuboard;
  #solvePuzzle;

  constructor(sudokuboard, solvePuzzle) {
    //using the SudokuBoard calss for handling the sudoku board
    this.#sudokuboard = sudokuboard;
    this.#solvePuzzle = solvePuzzle;

    //add some example puzzles here
    //source: https://www.sudokuonline.io/
    this.examples = {
      Reset: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      Wrong: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ],
      Unsolvable: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      Easy: [
        [1, 0, 0, 0, 0, 7, 0, 0, 3],
        [9, 0, 6, 0, 0, 8, 2, 0, 4],
        [0, 3, 0, 5, 2, 0, 0, 9, 0],
        [3, 9, 0, 0, 0, 1, 5, 0, 0],
        [0, 0, 5, 0, 0, 0, 9, 0, 0],
        [0, 0, 1, 2, 0, 0, 0, 4, 7],
        [0, 2, 0, 0, 6, 5, 0, 1, 0],
        [5, 0, 8, 1, 0, 0, 7, 0, 2],
        [6, 0, 0, 7, 0, 0, 0, 0, 5],
      ],
      Medium: [
        [0, 8, 0, 0, 4, 0, 5, 7, 0],
        [4, 0, 0, 1, 0, 7, 0, 0, 0],
        [5, 0, 0, 0, 9, 0, 0, 0, 0],
        [0, 5, 0, 0, 0, 1, 0, 8, 0],
        [9, 0, 3, 0, 0, 0, 6, 0, 5],
        [0, 6, 0, 5, 0, 0, 0, 9, 0],
        [0, 0, 0, 0, 8, 0, 0, 0, 3],
        [0, 0, 0, 4, 0, 6, 0, 0, 8],
        [0, 1, 2, 0, 3, 0, 0, 6, 0],
      ],
      Hard: [
        [0, 0, 0, 4, 0, 5, 8, 9, 0],
        [0, 0, 0, 0, 0, 0, 5, 0, 0],
        [0, 2, 0, 0, 0, 3, 7, 0, 0],
        [8, 0, 0, 0, 5, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 7, 0, 3, 0],
        [5, 0, 0, 0, 2, 0, 6, 1, 0],
        [4, 0, 0, 0, 0, 2, 0, 0, 0],
        [3, 9, 0, 0, 0, 1, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
      ],
      Evil: [
        [0, 4, 0, 2, 0, 0, 0, 7, 0],
        [3, 9, 0, 0, 0, 7, 0, 8, 1],
        [7, 0, 6, 0, 0, 1, 4, 0, 2],
        [0, 0, 0, 0, 0, 0, 3, 0, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 7, 0, 0, 0, 0, 0, 0],
        [1, 0, 4, 3, 0, 0, 8, 0, 5],
        [2, 6, 0, 1, 0, 0, 0, 3, 7],
        [0, 8, 0, 0, 0, 2, 0, 6, 0],
      ],
    };

    //rendering the table
    this.render();
  }

  /* getting all values from the UI inputs
    return: a 2D array what is given by the user */
  extractInputs() {
    this.#sudokuboard.setBoard(
      this.#sudokuboard.cells.map((cell) => +cell.getRef().value)
    );
  }

  /**************************/
  /* UI inputs manipulation */
  /**************************/

  /* updateing the UI with a puzzle or solution
    arg:    puzzle n x n sized 2D array
    return: a boolean true means the column doesn't has duplicates */
  updateUICells() {
    this.#sudokuboard.cells.forEach(
      (cell) => (cell.getRef().value = +cell.value || "")
    );

    this.upadateCells();
  }

  /* the method updating the SudokuBoard according to the UI input value
      arg:    e Event,
      return: undefined */
  updateUICell(e) {
    e.preventDefault();

    const [x, y, value] = [
      +e.target.dataset.col,
      +e.target.dataset.row,
      +e.target.value,
    ];
    const cell = this.#sudokuboard.getCellByCoords(x, y);
    const { min, max, unfilled } = cell.getAccepted();
    try {
      this.#sudokuboard.setCellValue({ x, y }, value || unfilled);
    } catch {
      this.userMsgTemporary({
        text: `Wrong value! You gave ${value}, but it must be between ${min}...${max}!`,
        delay: 2000,
      });
    }
    e.target.value = cell.value !== unfilled ? cell.value : "";

    this.upadateCells();
  }

  /* all the issued cells gets the issued class and style */
  upadateCells() {
    this.#sudokuboard.cells.forEach((cell) => this.setCellStyle(cell));
  }

  /* setting the HTML element classes end style of the cell HTML element
  arg:      cell (object)
  return:   undefined */
  setCellStyle(cell) {
    cell.issued
      ? cell.getRef().classList.add("issue")
      : cell.getRef().classList.remove("issue");
    cell.given
      ? cell.getRef().classList.add("given")
      : cell.getRef().classList.remove("given");
    cell.getRef().disabled = cell.given;
  }

  /* getting all values from the UI inputs
    return: a 2D array what is given by the user */
  extractInputs() {
    this.#sudokuboard.setBoard(
      this.#sudokuboard.cells.map((cell) => +cell.getRef().value)
    );
  }

  /****************/
  /* non-React UI */
  /****************/

  /* throw a message
   * first argument is the text,
   * the second object has one properties:
   ** alert, gives allert as well, and
   ** the type of the print to console. */
  userMsg(text, type = "none") {
    this.errors.innerHTML = text;
    const alerting = {
      alert: () => alert(text),
      log: () => console[type](text),
      error: () => console[type](text),
      none: () => null,
    };
    alerting[type]();
  }
  /* throw a message
   * first argument is the text,
   * the second object has one properties:
   ** alert, gives allert as well, and
   ** the type of the print to console. */
  userMsgTemporary(
    { text, prevMsg, delay, type } = {
      delay: 1500,
      type: "none",
    }
  ) {
    if (this.userMessageTimeout) {
      clearTimeout(this.userMessageTimeout);
    } else if (!prevMsg) this.prevMsg = this.errors.innerHTML;
    this.userMsg(text);
    this.userMessageTimeout = setTimeout(
      () => this.userMsg(this.prevMsg, type),
      delay
    );
  }

  /* rendering the entire table from the SudokuBoard */
  render() {
    // if it is once rendered then should be saved to the class

    //HTML element of the board
    this.board = document.getElementById("board");
    //HTML element of the error message
    this.errors = document.getElementById("errors");

    this.#sudokuboard.getAllRows().forEach((row) => this.renderRow(row));

    for (let puzzle in this.examples) {
      this.renderButton(puzzle, () => {
        this.#sudokuboard.setBoard(this.examples[puzzle], true);
        this.updateUICells();
        this.userMsgTemporary({
          text: `Puzzle changed to ${puzzle}!`,
          delay: 2000,
        });
      });
    }
    this.renderButton("Solve!", () => {
      this.extractInputs();
      this.#solvePuzzle();
    });
  }

  /* rendering the rows, the only div and iterating throught the cells of each
      arg:    Batch (object)
      return: undefined */
  renderRow(row) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add(`row`);
    rowContainer.classList.add(`nr-${row.id}`);
    this.board.appendChild(rowContainer);
    row.getCells().forEach((cellInfo) => {
      this.createInput(cellInfo, rowContainer);
    });
  }

  /* generating the DOM of a cell input, the arguments are the following:
      arg:    cellInfo Cell (object)
              parent: the DOM element who is the parent of the input (cell)
      return: undefined */
  createInput(cellInfo, parent) {
    const cellDOM = document.createElement("input");
    cellDOM.type = "number";
    cellDOM.step = 1;
    cellDOM.min = cellInfo.getAccepted().min;
    cellDOM.max = cellInfo.getAccepted().max;
    cellDOM.id = cellInfo.id;
    cellDOM.classList.add("tile");
    cellDOM.dataset.row = cellInfo.y;
    cellDOM.dataset.col = cellInfo.x;
    cellDOM.dataset.box = cellInfo.boxId;
    cellDOM.addEventListener("change", (e) => this.updateUICell(e));
    parent.appendChild(cellDOM);
    cellInfo.setRef(cellDOM);
  }

  /* buttons for the contorl panel, the arguments are the following:
    text  -> text of the button
    cb -> the callback function what is fired when the button is clicked */
  renderButton(text, cb) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", () => {
      cb();
    });
    document.getElementById("control").appendChild(button);
  }
}
