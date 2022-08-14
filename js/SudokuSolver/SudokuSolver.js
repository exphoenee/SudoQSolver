"use strict";

/*************************************************************************
usage of this class:
make a new object like this: const solver = new Solver(params)
you can set the params in the constructor
the params are the followings:
      * boxSize - this is only valid for 3x3 sudoku puzzles,
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
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;

  constructor({ boxSizeX, boxSizeY }) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#boxSizeX = boxSizeX || 3;
    this.#boxSizeY = boxSizeY || 3;

    //using the SudokuBoard calss for handling the sudoku board
    this.#sudokuboard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
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
    }

    if (this.#sudokuboard.puzzleIsCorrect()) {
      const result = this.#solve();
      if (result) {
        const formatting = {
          string: () => this.toString(result),
          default: () => result,
        };

        return formatting[format]();
      }
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
        const temporaryBoard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
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
}
