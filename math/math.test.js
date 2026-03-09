const {
  add,
  subtract,
  multiply,
  divide,
  squareRoot,
  maxNum,
} = require("./math");

describe("testing math", () => {
  test("take in 2 numbers and return the sum", () => {
    //add
    expect(add(1, 2)).toBe(3);
  });

  test("take in 2 parameters and return the difference", () => {
    //subtract
    expect(subtract(7, 4)).toBe(3);
  });

  test("take in 2 numbers and return the product", () => {
    //multiply
    expect(multiply(5, 5)).toBe(25);
  });

  test("take in 2 parameters and return the quotient", () => {
    //divide
    expect(divide(10, 2)).toBe(5);
  });

  //   (Use Math's sqrt function)
  test("take in a number and return the square root", () => {
    //square root
    expect(squareRoot(16)).toBe(4);
  });

  //   (Use Math's max function)
  test("take in 2 parameters and return the max", () => {
    //max num
    expect(maxNum(101, 50)).toBe(101);
  });
});
