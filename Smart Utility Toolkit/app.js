const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

console.log("Is 10 even? - ", isEven(10));
console.log("Is 7 even? - ", isEven(7));

logger("This is a test message.");
