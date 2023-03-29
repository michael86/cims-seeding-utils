const invoices = require("./seeds/invoices");
const stock = require("./seeds/stock");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\x1b[35m");
console.log(
  "before running this app, please make sure you have set up the enviroment and config",
  "\x1b[0m"
);

readline.question("Press enter to continue\n", () => {
  readline.question(
    `What tables do you want to seed:
      1: invoices
      2: stock
      3: Everything\n`,

    async (option) => {
      switch (+option) {
        case 1:
          await invoices();
          break;

        case 2:
          await stock();
          break;
        case 3:
          await invoices();
          await stock();
          break;
        default:
          console.log("something went wrong");
          break;
      }
      process.exit();
    }
  );
});
