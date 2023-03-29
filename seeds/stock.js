const utils = require("../utils");

const main = async () => {
  const stock = await utils.generateStock();
  const companies = await utils.getCompanyIds();

  await utils.insertStock(stock, companies);
  // await generateHistory();

  //
  //   const invoices = await createInvoices();
  //   invoices && (await seedDatabase(invoices));
};

module.exports = main;
