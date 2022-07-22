class Solver {
  constructor(initialBoard = null, sectionSize = null) {
    //the size of a section and matrix of sections n x n
    this.sectionSize = sectionSize || 3;
    //calculated value of cells in the index form the section size
    this.cellsInSection = this.sectionSize ** 2;
    //array of issued cells
    //HTML element of the board
    this.board = document.getElementById("board");

    //rendering the table
    this.render();
    //initialBoard && this.update(initialBoard);
  }

  /* non-React UI */

  /* rendering the entire table */
  render() {
    for (let rowNr = 0; rowNr < this.cellsInSection; rowNr++) {
      this.renderRow(rowNr);
    }
  }

  /* rendering the rows */
  renderRow(rowNr) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add(`row-${rowNr}`);
    for (let colNr = 0; colNr < this.cellsInSection; colNr++) {
      this.createInput(colNr, rowNr, rowContainer);
    }
    this.board.appendChild(rowContainer);
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
  }
}

const solver = new Solver();
