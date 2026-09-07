// Get the values passed from the terminal
const operation = process.argv[2];
const num1 = Number(process.argv[3]);
const num2 = Number(process.argv[4]);

// Perform the requested operation
if (operation === "add") {
  console.log("Result:", num1 + num2);
} else if (operation === "subtract") {
  console.log("Result:", num1 - num2);
} else if (operation === "multiply") {
  console.log("Result:", num1 * num2);
} else if (operation === "divide") {
  if (num2 === 0) {
    console.log("Error: can't divide by 0.");
  } else {
    console.log("Result:", num1 / num2);
  }
} else {
  console.log("Invalid operation.");
}
