const config = require("../config.json");
const { getRandomNumberInRange, getData } = require("../utils");

const { runQuery } = require("../modules/mysql/sql");
const {
  insert,
  selectCompanies,
  updateSkuDate,
  insertLocation,
  selectLocation,
  insertLocationRelation,
} = require("../modules/mysql/query");

const getSqlDate = () => {
  const maxDate = Date.now();
  const date = new Date(Math.floor(Math.random() * maxDate));

  const year = date.getFullYear();
  const month = date.getMonth() + 1; //Cause month is the only one that counts from 0!! cheers js.
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};

const generateStock = async () => {
  console.log("generating stock data");
  const data = await getData("appliances", config.stockCount);
  const skus = [];
  const temp = [];

  for (const { equipment } of data) temp.push(equipment);

  //remove duplicates due to db constraints
  const unique = [...new Set(temp)];
  for (const sku of unique) {
    const item = {
      sku,
      quantity: getRandomNumberInRange(0, 999999),
      price: getRandomNumberInRange(0, 100000),
      image_name: null,
      free_issue: 0,
      date: getSqlDate(),
    };

    skus.push(item);
  }

  return skus;
};

const getcompanyIds = async () => {
  const data = await runQuery(selectCompanies());
  const ids = [];
  for (const { id } of data) {
    ids.push(id);
  }

  return ids;
};

const createLocations = async (stockId) => {
  console.log("generating locations for stockId: ", stockId);
  const locations = [
    { name: 1, value: 1 },
    { name: 2, value: 2 },
    { name: 3, value: 3 },
    { name: 4, value: 4 },
    { name: 5, value: 5 },
    { name: 6, value: 6 },
    { name: 7, value: 7 },
    { name: 8, value: 8 },
    { name: 9, value: 9 },
    { name: 10, value: 10 },
    { name: 11, value: 11 },
    { name: 12, value: 12 },
    { name: 13, value: 13 },
    { name: 14, value: 14 },
    { name: 15, value: 15 },
    { name: 16, value: 16 },
    { name: 17, value: 17 },
    { name: 18, value: 18 },
    { name: 19, value: 19 },
    { name: 20, value: 20 },
  ];

  const count = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < count; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];

    let res = await runQuery(insertLocation(), [location.name, location.value]);

    if (res === "ER_DUP_ENTRY")
      res = await runQuery(selectLocation(), [location.name, location.value]);

    await runQuery(insertLocationRelation(), [stockId, res.insertId || res[0].id]);
  }
};

const insertStock = async (stock, companies) => {
  console.log("inserting stock and creating relations");
  try {
    for (const item of stock) {
      console.log("inserting ", item.sku);
      const res = await runQuery(
        insert("stock", ["sku", "quantity", "price", "image_name", "free_issue"]),
        [item.sku, item.quantity, item.price, item.image_name, item.free_issue]
      );

      const { insertId } = res;
      await runQuery(updateSkuDate(), [item.date, insertId]);

      await runQuery(insert("user_stock", ["user_id", "stock_id"]), [config.userId, insertId]);

      await runQuery(insert("stock_company", ["stock_id", "company_id"]), [
        insertId,
        companies[Math.floor(Math.random() * companies.length)],
      ]);

      await createLocations(insertId);
    }
  } catch (err) {
    console.log(err);
  }
};

const main = async () => {
  const stock = await generateStock();
  const companies = await getcompanyIds();

  await insertStock(stock, companies);

  console.log("need to make history");
  //
  //   const invoices = await createInvoices();
  //   invoices && (await seedDatabase(invoices));
};

module.exports = main;
