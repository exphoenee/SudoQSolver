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
  #sectionSize;
  #renderMyself;
  #cellsInSection;
  #cells;
  #sudokuboard;

  constructor(params = null) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#sectionSize = params.sectionSize || 3;
    //if it is true the calss rendering himself (...or herself)
    this.#renderMyself = params.renderMyself || false;
    //calculated value of cells in the index form the section size
    this.#cellsInSection = this.#sectionSize ** 2;
    //array of cells
    this.#cells = [];
    //using the SudokuBoard calss for handling the sudoku board
    this.#sudokuboard = new SudokuBoard(this.#sectionSize, this.#sectionSize);

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
    params.renderMyself && this.render();
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
      this.#sudokuboard.setBoard(this.#extractInputs());
      this.#update();
    }

    if (this.isPuzzleCorrect()) {
      const result = this.#solve();
      if (result) {
        this.#update(result);
        this.#userMsg("That was easy!");

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
    arg:    puzzle n x n sized 2D array
    return: boolean that means the puzzle is solved (ture) or not (false) */
  #solve() {
    return this.puzzleIsSolved()
      ? this.#getValuesFormBoard()
      : this.#checkPossiblities(
          this.#validatePosiblities(this.#getPosiblities())
        );
  }

  #validatePosiblities(puzzles) {
    return puzzles.filter((puzzle) => this.isPuzzleCorrect(puzzle));
  }

  /* generating 9 different puzzles, where the first free cell is filled with all the possible numbenr 1...n
    arg:    puzzle n x n sized 2D array
    return: possiblities m x (n x n) sized 3D array
                  number <┘      └> puzzle
              of possivilities */
  #getPosiblities() {
    const puzzle = this.#getValuesFormBoard();
    let possibilities = [];
    const nextCell = this.#getNextCell(puzzle);
    /* i tryed hard make it with map method, but i am failed... that took almost an hour... :( */
    if (nextCell) {
      for (let nr = 1; nr <= this.#cellsInSection; nr++) {
        let possibility = [...puzzle];
        let row = [...possibility[nextCell.y]];
        row[nextCell.x] = nr;
        possibility[nextCell.y] = row;
        possibilities.push(possibility);
      }
    }
    return possibilities;
  }

  /* find and return back the nexFree cell
    arg: puzzle n x n sized 2D array
    return: an object with the
      * x (number of column) and
      * y (number of row) coordinates */
  #getNextCell(puzzle) {
    for (let rowNr = 0; rowNr < puzzle.length; rowNr++) {
      const x = puzzle[rowNr].indexOf(0, 0);
      if (x > -1) return { x, y: rowNr };
    }
  }

  /* generates the map of the puzzle
    arg:    puzzle n x n sized 2D array
    return: an n x n sized 2D array of objects with the:
      * value what is in the cell written
      * x (number of column) and
      * y (number of row) coordinates */
  generateMap(puzzle) {
    return puzzle.map((row, y) => {
      return row.map((cell, x) => {
        return { value: cell, x, y };
      });
    });
  }

  /* check the possibilities if there is any:
      * takes the first, and check that good is (recourevely),
      * if not generates new possibilities and returns that (recourevely),
      * returns a puzzle of a flase is there is not any solution
      arg: possiblities m x (n x n) sized 3D array
                number <┘      └> puzzle
          of possivilities */
  #checkPossiblities(possiblities) {
    if (possiblities.length > 0) {
      let possiblity = possiblities.shift();
      const treeBranch = this.#solve(possiblity);
      return treeBranch ? treeBranch : this.#checkPossiblities(possiblities);
    } else {
      return false;
    }
  }

  /* creates a tempoaray sudokuboard, and fills it with a puzzle:
  arg:    a puzzle (1D or 2D array or String)
  retrun: the temporary board (SudokuBoard class) */
  #createTemporaryBoard(puzzle) {
    return new SudokuBoard(this.#sectionSize, this.#sectionSize).setBoard(
      puzzle
    );
  }

  /* extracts teh cell values form the SudokuBoardClass
  arg:    null,
  return: 2D array of integer  */
  #getValuesFormBoard() {
    return this.#sudokuboard.getCellValues({
      format: "2D",
      unfilledChar: "0",
    });
  }

  /***********************************/
  /* methods for checking the puzzle */
  /***********************************/

  /* checks the puzzle is solved already or didn't
      arg:     puzzle n x n sized 2D array
      returns: a boolean only ture is puzzle solved */
  puzzleIsSolved() {
    return !this.#sudokuboard.coordsOfFirstFreeCell();
  }

  /* if everything is fine, that means there is no issue in the
      * rows,
      * columns, and
      * n x n boxes, then the table is correct
    arg:    puzzle n x n sized 2D array
    return: a boolean true means the puzzle seems to solvable */
  isPuzzleCorrect() {
    return this.#getValuesFormBoard(puzzle).puzzleIsCorrect();
  }

  /* TODO: it is not implemented yet */
  #getPossibleNumbers() {}

  /* checking all the values are unique in the rows
    arg:    puzzle n x n sized 2D array
    return: a boolean true means the row doesn't has duplicates */
  #rowsCorrect(puzzle) {
    return puzzle.every((row) => this.#batchCorrect(row));
  }

  /* the method checks that in the given batch is every number is only once present
    arg:    batch n sized 1D array, that represents
      * a row,
      * a column or
      * a flattened box)
    return: a boolean true means the row doesn't has duplicates */
  #batchCorrect(batch) {
    const onlyNums = batch.filter((num) => this.#validateValue(num) != 0);
    return new Set(onlyNums).size == onlyNums.length;
  }

  /* this method checks all the columns has unique numbers
    arg:    puzzle n x n sized 2D array
    return: a boolean true means the column doesn't has duplicates */
  #columnsCorrect(puzzle) {
    return this.#getColumnsOfPuzzle(puzzle).every((col) =>
      this.#batchCorrect(col)
    );
  }

  /* TODO: it is not implemented yet */
  /* this method checks a batches and gets the unique numbers
    arg:    batch n sized 1D array, that represents
      * a row,
      * a column or
      * a flattened box)
    return: an array of objects that contains:
      * */
  getMissingFromBatch(batch) {
    return true;
  }

  /* this method transposes the 2D array
    arg:    puzzle n x n sized 2D array, to getting the columns in order
    return: puzzle that is transposed */
  #getColumnsOfPuzzle(puzzle) {
    return puzzle[0].map((col, colNr) => puzzle.map((row) => row[colNr]));
  }

  /* getting the n x n boxes form the puzzle
    arg:    n x n sized 2D array
    return: all sections flattened, seems that are
      * row or
      * columns,
      * but they aren't!!! */
  /* TODO: maybe that is not enough efficient here I need some help to do it better */
  #getBoxes(puzzle) {
    let boxTemplate = [];

    boxTemplate = this.#getColumnsOfPuzzle(
      puzzle.map((row) => {
        const boxRows = [];
        for (let i = 0; i < row.length; i += this.#sectionSize) {
          boxRows.push(row.slice(i, i + this.#sectionSize));
        }
        return boxRows;
      })
    );

    /* I couldn't solve that in the first iteration... */
    let boxes = [];
    boxTemplate.forEach((row) => {
      for (let j = 0; j < this.#cellsInSection; j += this.#sectionSize) {
        let box = [];
        for (let i = 0; i < this.#sectionSize; i++) {
          box = box.concat(row[j + i]);
        }
        boxes.push(box);
      }
    });

    return boxes;
  }

  /* check the n x n sized sections arg), the boxes, there is not replication of numbers present */
  #boxesCorrect(puzzle) {
    let boxes = this.#getBoxes(puzzle);
    return boxes.every((box) => this.#batchCorrect(box));
  }

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
  #update(setGiven = false) {
    this.#renderMyself &&
      this.#sudokuboard.cells().forEach((cell) => {
        this.cell.id();
      });
    return puzzle;
  }

  /* getting all values from the UI inputs
    return: a 2D array what is given by the user */
  #extractInputs() {
    this.#sudokuboard.setBoard(
      this.#cells.map((row) => row.map((cell) => +cell.value))
    );
  }

  /* checking and correcting the input values, change the values that are 0 and greater as possible to empty string
    arg:    value (integer or string)
    return: a value (what is allowed for the puzzle) */
  #validateValue(value) {
    return value >= 1 && value <= this.#cellsInSection ? value : "";
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

  /* rendering the entire table */
  render() {
    // if it is once rendered then should be saved to the class
    this.#renderMyself = true;

    //HTML element of the board
    this.board = document.getElementById("board");
    //HTML element of the error message
    this.errors = document.getElementById("errors");

    for (let rowNr = 0; rowNr < this.#cellsInSection; rowNr++) {
      this.#cells.push(this.#renderRow(rowNr));
    }

    for (let puzzle in this.examples) {
      this.#renderButton(puzzle, () =>
        this.#update(this.examples[puzzle], true)
      );
    }
    this.#renderButton("Solve!", () => this.solvePuzzle());
  }

  /* rendering the rows, the only arguments is the row number, that is passed to the inputs returns the DOM element */
  #renderRow(rowNr) {
    let row = [];
    const rowContainer = document.createElement("div");
    rowContainer.classList.add(`row`);
    rowContainer.classList.add(`nr-${rowNr}`);
    for (let colNr = 0; colNr < this.#cellsInSection; colNr++) {
      row.push(this.#createInput(colNr, rowNr, rowContainer));
    }
    this.board.appendChild(rowContainer);
    return row;
  }

  /* generating the DOM of a cell input, the arguments are the following:
    colNr  -> the x / horizontal coordinate (in caresian system)
    rowNr  -> the y / horizontal coordinate (in caresian system)
    parent -> the DOM element who is the parent of the input (cell)
    returns the DOM element of cell */
  #createInput(colNr, rowNr, parent) {
    const cell = document.createElement("input");
    cell.type = "number";
    cell.step = 1;
    cell.min = 1;
    cell.max = this.#cellsInSection;
    cell.id = `C${Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(8, 0)}`;
    cell.classList.add("tile");
    cell.dataset.col = colNr;
    cell.dataset.row = rowNr;
    cell.addEventListener("change", (e) => this.#update(e));
    parent.appendChild(cell);
    return cell;
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
