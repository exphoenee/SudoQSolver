const SudokuGenerator = require("../SudokuGenerator.mjs");
// @ponicode
describe("SudokuGenerator.default.setARandomCellToRandomValue", () => {
  let inst;

  beforeEach(() => {
    inst = new SudokuGenerator.default();
  });

  test("0", () => {
    let result = inst.setARandomCellToRandomValue();
    expect(result).toMatchSnapshot();
  });
});
