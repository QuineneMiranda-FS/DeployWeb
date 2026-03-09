//add
const add = (a, b) => a + b;
//subtract
const subtract = (a, b) => a - b;
//multiply
const multiply = (a, b) => a * b;
//divide
const divide = (a, b) => a / b;
//square root (Use Math's sqrt function)
const squareRoot = (num) => Math.sqrt(num);
//max num (Use Math's max function)
const maxNum = (a, b) => Math.max(a, b);

module.exports = {
  add,
  subtract,
  divide,
  multiply,
  squareRoot,
  maxNum,
};
