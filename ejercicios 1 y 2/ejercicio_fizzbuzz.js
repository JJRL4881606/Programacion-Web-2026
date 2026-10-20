// b fizzbuzz
function fizzBuzz(n) {
  if (n === "" || n === null || n === undefined || typeof n !== "number" ||
      isNaN(n) || n <= 0 || !Number.isInteger(n)) {
    console.log("error, n debe ser un entero positivo");
    return;
  }

  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(`${i}`);
  }
}

fizzBuzz(15);