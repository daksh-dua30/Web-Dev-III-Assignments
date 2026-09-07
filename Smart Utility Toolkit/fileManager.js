const fs = require("fs");

const fileName = "test.txt";

// creating file
console.log("Creating File...");
fs.writeFile(fileName, "Hello Node.js", (err) => {
  if (err) {
    console.log("Error creating file");
    return;
  }
  console.log("File Created");

  // reading file
  console.log("Reading File");

  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file");
      return;
    }
    console.log(data);

    // updating file
    fs.appendFile(fileName, " File Module", (err) => {
      if (err) {
        console.log("Error updating file");
        return;
      }
      console.log("File Updated");

      // reading updated file
      fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
          console.log("Error reading updated file");
          return;
        }
        console.log(data);

        // deleting file
        fs.unlink(fileName, (err) => {
          if (err) {
            console.log("Error deleting file");
            return;
          }
          console.log("File Deleted");
        });
      });
    });
  });
});
