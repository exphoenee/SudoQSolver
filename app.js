class Solver {
  constructor(initialBoard = null, sectionSize = null) {
    //the size of a section and matrix of sections n x n
    this.sectionSize = sectionSize || 3;
    //calculated value of cells in the index form the section size
    this.cellsInSection = this.sectionSize ** 2;
    //HTML element of the board
    this.board = document.getElementById("board");
    //array of cells
    this.cells = [];

    //add some example puzzles here
    //source: https://www.sudokuonline.io/
    this.examples = {
      noSolution: [
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
        [6, 0, 0, 8, 4, 9, 0, 0, 2],
        [0, 0, 0, 3, 0, 2, 0, 0, 0],
        [0, 2, 3, 0, 0, 0, 0, 9, 6],
        [1, 4, 0, 0, 0, 0, 0, 8, 3],
        [5, 0, 0, 0, 0, 0, 0, 0, 9],
        [9, 3, 0, 0, 0, 0, 0, 2, 5],
        [0, 5, 6, 0, 0, 0, 3, 1, 0],
        [0, 0, 0, 6, 0, 5, 0, 0, 0],
        [2, 0, 0, 7, 8, 3, 0, 0, 6],
      ],
      hard: [
        [0, 0, 0, 0, 7, 0, 0, 0, 6],
        [0, 6, 0, 8, 0, 9, 1, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 8, 0],
        [0, 3, 0, 0, 5, 7, 0, 9, 0],
        [2, 0, 0, 9, 3, 4, 0, 0, 9],
        [0, 5, 0, 2, 8, 0, 0, 7, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 6, 5, 0, 2, 0, 4, 0],
        [5, 0, 0, 0, 1, 0, 3, 0, 0],
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
    this.render();
    //initialBoard && this.update(initialBoard);
  }

  update(puzzle) {
    this.cells.forEach((row, rowNr) =>
      row.forEach((cell, colNr) => (cell.value = puzzle[rowNr][colNr]))
    );
  }

  extractInputs() {
    return this.cells.map((row) => row.map((cell) => +cell.value));
  }

  /* non-React UI */

  /* rendering the entire table */
  render() {
    for (let rowNr = 0; rowNr < this.cellsInSection; rowNr++) {
      this.cells.push(this.renderRow(rowNr));
    }
    for (let puzzle in this.examples) {
      this.renderButton(puzzle, () => this.update(this.examples[puzzle]));
    }
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

const solver = new Solver();
