"use strict";

/*************************************************************************
usage of this class:
make a new object like this: const solver = new Solver(params)
you can set the params in the constructor
the params are the followings:
      * sectionSize - this is only valid for 3x3 sudoku puzzles,
        because the CSS did not written well
        later not only square but recatngular puzzles will be
        available also, but the solver works for other sized
        puzzles already
      * the calss can be rendered a basic UI self, that is
        avalaiable the renderMyself param
after the class implemented, you can pass a puzzle for him (or her)
using the solvePuzzle(solverforNode.examples.easy)) method
athe argument for the method is an 2D array, where every row is an
subarray e. g.:
        [
          [1...n],
          [1...n]
          ...
          m times (currently m = n only possible)
          ...
          [1...n]
        ]
where n and m the x and y dimension of the sudoku, currently the n = m
*************************************************************************/
class SudokuSolver {
  #renderMyself;
  #sudokuboard;
  #sectionSizeX;
  #sectionSizeY;
  #cellsInSection;
  #columns;
  #rows;
  #render;

  constructor({ renderMyself, sectionSizeX, sectionSizeY }) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#sectionSizeX = sectionSizeX || 3;
    this.#sectionSizeY = sectionSizeY || 3;
    this.#columns = sectionSizeX ** 2;
    this.#rows = sectionSizeY ** 2;

    //calculated value of cells in the index form the section size
    this.#cellsInSection = this.#rows * this.#columns;

    //if it is true the calss rendering himself (...or herself)
    this.#renderMyself = renderMyself;

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

    //using the SudokuBoard calss for handling the sudoku board
    this.#sudokuboard = new SudokuBoard(this.#sectionSizeX, this.#sectionSizeY);

    //rendering the table
    renderMyself && (this.#render = new SudokuRenderer(this.sudokuboard));
  }

  get sudokuboard() {
    return this.#sudokuboard;
  }

  /**********************************/
  /* methods for the puzzle solving */
  /*     here comes the magic...    */
  /**********************************/

  /* this is the entry point of the solver
    arg:  optionally a puzzle n x n sized 2D array
    returns:
      * the solved puzzle n x n sized 2D array
      * or a boolen which value can be only false what mean there is no solution for this puzzle */
  solvePuzzle(puzzle = null, format = "default") {
    if (puzzle) {
      this.#sudokuboard.setBoard(puzzle);
    } else if (this.#renderMyself) {
      this.#extractInputs();
    }

    if (this.#sudokuboard.puzzleIsCorrect()) {
      const result = this.#solve();
      if (result) {
        this.#updateUICells();
        const formatting = {
          string: () => this.toString(result),
          default: () => result,
        };

        return formatting[format]();
      } else {
        this.#userMsg("There is no solution for this puzzle...", "error");
      }
    } else {
      this.#userMsg("The puzzle is not correct!", "alert");
    }
    return false;
  }

  /* this method is the entry for making solution possiblities and filtrind out the not valid solution
    arg:    null
    return: boolean that means the puzzle is solved (ture) or not (false) */
  #solve() {
    return !this.#sudokuboard.coordsOfFirstFreeCell()
      ? this.#sudokuboard.getCellValues({ format: "2D" })
      : this.#checkPossiblities(this.#getPosiblities());
  }

  /* generating (k-j) different puzzles, where the first free cell is filled with all the possible numbenr j...k
    arg:    puzzle n x n sized 2D array
    return: m pieces of SudokuBorad class therefrom filtered out the incorrect versions */
  #getPosiblities() {
    const nextCell = this.#sudokuboard.getFirstFeeCell();

    if (nextCell) {
      const posNums = this.#sudokuboard.getCellPossiblities(nextCell);
      return posNums.map((nr) => {
        const temporaryBoard = new SudokuBoard(
          this.#sectionSizeX,
          this.#sectionSizeY
        );
        temporaryBoard.setBoard(this.#sudokuboard.getCellValues());
        temporaryBoard.setCellValue({ x: nextCell.x, y: nextCell.y }, nr);
        return temporaryBoard;
      });
      //.filter((puzzle) => puzzle.puzzleIsCorrect());
      /* TODO: lehet hogy ez a lépés teljesen felesleges, át kell gondolnom...hiszan ha már levizsgáltk, mit lehet egy adott cellába írni, akkor után már nem okozhat problémát */
    }
    return false;
  }

  /* check the possibilities if there is any:
      * takes the first, and check that good is (recourevely),
      * if not generates new possibilities and returns that (recourevely),
      * returns a puzzle of a flase is there is not any solution
      arg: m pieces of SudokuBorad class therefrom filtered out the incorrect versions
      return: boolean only false value, or
              n pieces of SudokuBorad class therefrom filtered out the incorrect versions */
  #checkPossiblities(possiblities) {
    if (possiblities.length > 0) {
      let possiblity = possiblities.shift();
      this.#sudokuboard.setBoard(possiblity.getCellValues({ format: "2D" }));
      const treeBranch = this.#solve(possiblity);
      return treeBranch ? treeBranch : this.#checkPossiblities(possiblities);
    } else {
      return false;
    }
  }

  /***********************************/
  /* methods for checking the puzzle */
  /***********************************/

  /* converts a table to string
    arg:    puzzle a 2D array n x n sized
    return: a flattened 2D array, what is joined to a String */
  toString(puzzle) {
    return this.createTemporaryBoard(puzzle).getCellValues({
      format: "string",
      unfilledChar: ".",
    });
  }

  /**************************/
  /* UI inputs manipulation */
  /**************************/

  /* updateing the UI with a puzzle or solution
    arg:    puzzle n x n sized 2D array
    return: a boolean true means the column doesn't has duplicates */
  #updateUICells() {
    this.#sudokuboard.cells.forEach(
      (cell) => (cell.getRef().value = +cell.value || "")
    );

    this.#upadateCells();
  }

  /* the method updating the SudokuBoard according to the UI input value
      arg:    e Event,
      return: undefined */
  #updateUICell(e) {
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
      this.#userMsgTemporary({
        text: `Wrong value! You gave ${value}, but it must be between ${min}...${max}!`,
        delay: 2000,
      });
    }
    e.target.value = cell.value !== unfilled ? cell.value : "";

    this.#upadateCells();
  }

  /* all the issued cells gets the issued class and style */
  #upadateCells() {
    this.#sudokuboard.cells.forEach((cell) => this.#setCellStyle(cell));
  }

  #setCellStyle(cell) {
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
  #extractInputs() {
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
  #userMsg(text, type = "none") {
    this.#renderMyself && (this.errors.innerHTML = text);
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
  #userMsgTemporary(
    { text, prevMsg, delay, type } = {
      delay: 1500,
      type: "none",
    }
  ) {
    if (this.userMessageTimeout) {
      clearTimeout(this.userMessageTimeout);
    } else if (!prevMsg) this.prevMsg = this.errors.innerHTML;
    this.#userMsg(text);
    this.userMessageTimeout = setTimeout(
      () => this.#userMsg(this.prevMsg, type),
      delay
    );
  }

  /* rendering the entire table from the SudokuBoard */
  render() {
    // if it is once rendered then should be saved to the class
    this.#renderMyself = true;

    //HTML element of the board
    this.board = document.getElementById("board");
    //HTML element of the error message
    this.errors = document.getElementById("errors");

    this.#sudokuboard.getAllRows().forEach((row) => this.#renderRow(row));

    for (let puzzle in this.examples) {
      this.#renderButton(puzzle, () => {
        this.#sudokuboard.setBoard(this.examples[puzzle], true);
        this.#updateUICells();
        this.#userMsgTemporary({
          text: `Puzzle changed to ${puzzle}!`,
          delay: 2000,
        });
      });
    }
    this.#renderButton("Solve!", () => {
      this.solvePuzzle();
    });
  }

  /* rendering the rows, the only div and iterating throught the cells of each
      arg:    Batch (object)
      return: undefined */
  #renderRow(row) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add(`row`);
    rowContainer.classList.add(`nr-${row.id}`);
    this.board.appendChild(rowContainer);
    row.getCells().forEach((cellInfo) => {
      this.#createInput(cellInfo, rowContainer);
    });
  }

  /* generating the DOM of a cell input, the arguments are the following:
      arg:    cellInfo Cell (object)
              parent: the DOM element who is the parent of the input (cell)
      return: undefined */
  #createInput(cellInfo, parent) {
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
    cellDOM.addEventListener("change", (e) => this.#updateUICell(e));
    parent.appendChild(cellDOM);
    cellInfo.setRef(cellDOM);
  }

  /* buttons for the contorl panel, the arguments are the following:
    text  -> text of the button
    cb -> the callback function what is fired when the button is clicked */
  #renderButton(text, cb) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", () => {
      cb();
    });
    document.getElementById("control").appendChild(button);
  }
}
