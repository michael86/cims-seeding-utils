const stock = require("../utils/stock");
const utils = require("../utils/index");

const main = async () => {
  const s = await stock.generate();
  const companies = await utils.getCompanyIds();

  await stock.insertStock(s, companies);
  // await generateHistory();

  //
  //   const invoices = await createInvoices();
  //   invoices && (await seedDatabase(invoices));
};

module.exports = main;
