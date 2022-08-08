"use strict";

//import { SudokuSolver } from "../SudokuSolver";
SudokuSolver = require("../SudokuSolver");

console.log("It works");

const solverforNode = new Solver({ renderMyself: false });
const solution = solverforNode.solvePuzzle(solverforNode.examples.easy);
console.log(solution);
