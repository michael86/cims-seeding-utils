const stock = require("../utils/stock");
const utils = require("../utils/index");

const main = async () => {
  const data = await stock.generate();
  const companies = await utils.getCompanyIds();

  await stock.insertStock(data, companies);
  await stock.generateHistory();
  await stock.syncDates();
  console.log("stock completed");

  //
  //   const invoices = await createInvoices();
  //   invoices && (await seedDatabase(invoices));
};

module.exports = main;
