"use strict";

const browser = false;
/*************************************************************************
before start using as a module in react clear this row on top,
and the testing functions bottom
/*************************************************************************/

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
          m times
          ...
          [1..n]
        ]
where n and m the x and y dimension of the sudoku, currently the n = m
*************************************************************************/
class Solver {
  constructor(params = null) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.sectionSize = params.sectionSize || 3;
    //if it is true the calss rendering himself (...or herself)
    this.renderMyself = params.renderMyself || false;
    //calculated value of cells in the index form the section size
    this.cellsInSection = this.sectionSize ** 2;
    //array of cells
    this.cells = [];

    //add some example puzzles here
    //source: https://www.sudokuonline.io/
    this.examples = {
      wrong: [
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
      noSolution: [
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
      clear: [
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
      easy: [
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
      medium: [
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
      hard: [
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
      evil: [
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

  /*
   * first reading out the UI,
   * checking that is valid filled or not,
   * start solving  */
  solvePuzzle(puzzle = null) {
    let startingPuzzle =
      this.renderMyself && !puzzle ? this.extractInputs() : puzzle;

    if (this.isPuzzleCorrect(startingPuzzle)) {
      const result = this.solve(startingPuzzle);
      if (result) {
        this.update(result);
        this.userMsg("That was easy!");
        return result;
      } else {
        this.userMsg("There is no solution for this puzzle...");
      }
    } else {
      this.userMsg("The puzzle is not correct!");
    }
    return false;
  }

  /* this method is the entry for making solution possiblities and filtrind out the not valid solution */
  solve(puzzle) {
    return this.puzzleIsSolved(puzzle)
      ? puzzle
      : this.checkPossiblities(
          this.validatePosiblities(this.getPosiblities(puzzle))
        );
  }

  validatePosiblities(puzzles) {
    return puzzles.filter((puzzle) => this.isPuzzleCorrect(puzzle));
  }

  /* generating 9 different puzzles, where the first free cell is filled with all the possible numbenr 1...n */
  getPosiblities(puzzle) {
    let possibilities = [];
    const nextCell = this.getNextCell(puzzle);
    /* i tryed hard make it with map method, but i am failed... that took almost an hour... :( */
    if (nextCell) {
      for (let nr = 1; nr <= this.cellsInSection; nr++) {
        let possibility = [...puzzle];
        let row = [...possibility[nextCell.y]];
        row[nextCell.x] = nr;
        possibility[nextCell.y] = row;
        possibilities.push(possibility);
      }
    }
    return possibilities;
  }

  /* find and return back the nexFree cell */
  getNextCell(puzzle) {
    for (let rowNr = 0; rowNr < puzzle.length; rowNr++) {
      const x = puzzle[rowNr].indexOf(0, 0);
      if (x > -1) return { x, y: rowNr };
    }
  }

  /* generates the map of the puzzle */
  generateMap(puzzle) {
    return puzzle.map((row, y) => {
      {
        return row.map((cell, x) => {
          return { value: cell, x, y };
        });
      }
    });
  }

  checkPossiblities(possiblities) {
    if (possiblities.length > 0) {
      let possiblity = possiblities.shift();
      const treeBranch = this.solve(possiblity);
      return treeBranch ? treeBranch : this.checkPossiblities(possiblities);
    } else {
      return false;
    }
  }

  puzzleIsSolved(puzzle) {
    return !puzzle.some((row) => row.some((cell) => cell == 0));
  }

  /***********************************/
  /* methods for checking the puzzle */
  /***********************************/

  /* if everything is fine, that means there is no issue in the rows, columns, and n x n boxes, then the table is correct*/
  isPuzzleCorrect(puzzle) {
    const rowsCorrect = this.rowsCorrect(puzzle);
    const columnsCorrect = this.columnsCorrect(puzzle);
    const boxesCorrect = this.boxesCorrect(puzzle);
    return rowsCorrect && columnsCorrect && boxesCorrect;
  }

  /* checking all the values are unique in the rows */
  rowsCorrect(puzzle) {
    return puzzle.every((row) => this.batchCorrect(row));
  }

  /* the method checks that in the given batch is every number is only once present */
  batchCorrect(batch) {
    const onlyNums = batch.filter((num) => this.validateValue(num) != 0);
    return new Set(onlyNums).size == onlyNums.length;
  }

  /* this method checks all the columns tha numbers are unique */
  columnsCorrect(puzzle) {
    let cols = this.getColumnsOfPuzzle(puzzle);
    return cols.every((col) => this.batchCorrect(col));
  }

  /* this method transposes the 2D array, to getting the columns */
  getColumnsOfPuzzle(puzzle) {
    return puzzle[0].map((col, colNr) => puzzle.map((row) => row[colNr]));
  }

  /* getting the n x n boxes form the puzzle */
  getBoxes(puzzle) {
    let boxTemplate = [];

    boxTemplate = this.getColumnsOfPuzzle(
      puzzle.map((row) => {
        const boxRows = [];
        for (let i = 0; i < row.length; i += this.sectionSize) {
          boxRows.push(row.slice(i, i + this.sectionSize));
        }
        return boxRows;
      })
    );

    /* I couldn't solve that in the first iteration... */
    let boxes = [];
    boxTemplate.forEach((row) => {
      for (let j = 0; j < this.cellsInSection; j += this.sectionSize) {
        let box = [];
        for (let i = 0; i < this.sectionSize; i++) {
          box = box.concat(row[j + i]);
        }
        boxes.push(box);
      }
    });

    return boxes;
  }

  /* check the n x n sized sections, the boxes, there is not replication of numbers present */
  boxesCorrect(puzzle) {
    let boxes = this.getColumnsOfPuzzle(puzzle);
    return boxes.every((box) => this.batchCorrect(box));
  }

  /**************************/
  /* UI inputs manipulation */
  /**************************/

  /* updaing the UI with a puzzle or solution */
  update(puzzle) {
    this.renderMyself &&
      this.cells.forEach((row, rowNr) =>
        row.forEach(
          (cell, colNr) =>
            (cell.value = this.validateValue(puzzle[rowNr][colNr]))
        )
      );
    return puzzle;
  }

  /* getting all values from the UI inputs */
  extractInputs() {
    return this.cells.map((row) => row.map((cell) => +cell.value));
  }

  /* checking and correcting the input values, change the values that are 0 and greater as possible to empty string */
  validateValue(value) {
    return value >= 1 && value <= this.cellsInSection ? value : "";
  }

  /****************/
  /* non-React UI */
  /****************/

  /* throw a message */
  userMsg(text, textOnly = true) {
    this.renderMyself && (this.errors.innerHTML = text);
    textOnly ? console.error(text) : alert(text);
  }

  /* rendering the entire table */
  render() {
    //HTML element of the board
    this.board = document.getElementById("board");
    //HTML element of the error message
    this.errors = document.getElementById("errors");
    // if it is once rendered then should be saved to the class
    this.renderMyself = true;
    for (let rowNr = 0; rowNr < this.cellsInSection; rowNr++) {
      this.cells.push(this.renderRow(rowNr));
    }
    for (let puzzle in this.examples) {
      this.renderButton(puzzle, () => this.update(this.examples[puzzle]));
    }
    this.renderButton("Solve!", () => this.solvePuzzle());
  }

  /* rendering the rows */
  renderRow(rowNr) {
    let row = [];
    const rowContainer = document.createElement("div");
    rowContainer.classList.add(`row-${rowNr}`);
    for (let colNr = 0; colNr < this.cellsInSection; colNr++) {
      row.push(this.createInput(colNr, rowNr, rowContainer));
    }
    this.board.appendChild(rowContainer);
    return row;
  }

  createInput(colNr, rowNr, parent) {
    const cell = document.createElement("input");
    cell.type = "number";
    cell.step = 1;
    cell.min = 1;
    cell.max = this.cellsInSection;
    cell.id = `C${Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(8, 0)}`;
    cell.classList.add("tile");
    cell.dataset.col = colNr;
    cell.dataset.row = rowNr;
    cell.addEventListener("change", (e) => this.update(e));
    parent.appendChild(cell);
    return cell;
  }

  /* buttons for the contorl panel */
  renderButton(text, cb) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", () => {
      cb();
    });
    document.getElementById("control").appendChild(button);
  }
}

if (browser) {
  /* testcase for browser */
  const solver = new Solver({ renderMyself: true });
} else {
  /* node.js test case */
  const solverforNode = new Solver({ renderMyself: false });
  console.log(solverforNode.solvePuzzle(solverforNode.examples.easy));
}
