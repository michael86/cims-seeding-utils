const axios = require("axios");
const config = require("../config.json");
const queries = require("../modules/mysql/query");

const { runQuery } = require("../modules/mysql/sql");
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
const utils = {
  getRandomNumberInRange: (min, max) => Math.floor(Math.random() * (max - min) + min),

  getRandomDate: (maxDate) => {
    //this sort of works some dueDates are in the past, but we're seeding. Investigate later
    const currentDate = Date.now();
    const timestamp = Math.floor(Math.random() * currentDate);
    return maxDate
      ? Math.floor(utils.getRandomNumberInRange(maxDate, currentDate) / 1000)
      : Math.floor(new Date(timestamp).getTime() / 1000);
  },

  getData: async (type, count = config.invoiceCount) => {
    const res = await axios.get(`https://random-data-api.com/api/v2/${type}?size=${count}`);

    if (!res.data) {
      throw new Error("Error getting data");
    }

    return res.data;
  },
  generateStock: async () => {
    console.log("generating stock data");
    const data = await utils.getData("appliances", config.stockCount);
    const stock = [];
    const temp = [];

    for (const { equipment } of data) temp.push(equipment);

    //remove duplicates due to db constraints
    const unique = [...new Set(temp)];
    for (const sku of unique) {
      const item = {
        sku,
        quantity: utils.getRandomNumberInRange(0, 999999),
        price: utils.getRandomNumberInRange(0, 100000),
        image_name: null,
        free_issue: 0,
        date: utils.getSqlDate(),
      };

      stock.push(item);
    }

    return stock;
  },
  getSqlDate: () => {
    const maxDate = Date.now();
    const date = new Date(Math.floor(Math.random() * maxDate));

    const year = date.getFullYear();
    const month = date.getMonth() + 1; //Cause month is the only one that counts from 0!! cheers js.
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  },
  getCompanyIds: async () => {
    const data = await runQuery(queries.selectCompanies());
    const ids = [];
    for (const { id } of data) {
      ids.push(id);
    }

    return ids;
  },
  createLocations: async (stockId) => {
    console.log("generating locations for stockId: ", stockId);

    const count = Math.floor(Math.random() * 5) + 1;
    const ids = [];
    for (let i = 0; i < count; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];

      let res = await runQuery(queries.insertLocation(), [location.name, location.value]);

      if (res === "ER_DUP_ENTRY")
        res = await runQuery(queries.selectLocation(), [location.name, location.value]);

      await runQuery(queries.insertLocationRelation(), [stockId, res.insertId || res[0].id]);
      ids.push(res.insertId || res[0].id);
    }

    return ids;
  },
  createHistory: async (data, stockId, locationIds = []) => {
    try {
      console.log(`creating history snapshot for ${data.sku}`);

      const res = await runQuery(queries.insertHistory(), [data.sku, data.quantity, data.price]);

      await runQuery(queries.updateHistoryDate(), [data.date, res.insertId]);

      await runQuery(queries.insertHistoryRelation(), [stockId, res.insertId]);

      for (const location of locationIds) {
        await runQuery(queries.insertHistorylocationRelation(), [res.insertId, location]);
      }
    } catch (err) {
      console.log(err);
    }
  },

  insertStock: async (stock, companies) => {
    console.log("inserting stock and creating relations");
    try {
      for (const item of stock) {
        console.log("inserting ", item.sku);
        const res = await runQuery(
          queries.insert("stock", ["sku", "quantity", "price", "image_name", "free_issue"]),
          [item.sku, item.quantity, item.price, item.image_name, item.free_issue]
        );

        const { insertId } = res;
        await runQuery(queries.updateSkuDate(), [item.date, insertId]);

        await runQuery(queries.insert("user_stock", ["user_id", "stock_id"]), [
          config.userId,
          insertId,
        ]);

        await runQuery(queries.insert("stock_company", ["stock_id", "company_id"]), [
          insertId,
          companies[Math.floor(Math.random() * companies.length)],
        ]);

        const locationIds = await utils.createLocations(insertId);

        await utils.createHistory(item, insertId, locationIds);
      }
    } catch (err) {
      console.log(err);
    }
  },
  generateHistory: async () => {
    const stock = await runQuery(queries.selectStock());

    for (const item of stock) {
      const count = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i <= count; i++) {
        //price, count, location
        const target = Math.floor(Math.random() * 3) + 1;
        switch (target) {
          case 1:
            item.price = getRandomNumberInRange(0, 100000);
            break;
          case 2:
            item.quantity = getRandomNumberInRange(0, 999999);
            break;
          case 3:
            console.log("locations");
            break;

          default:
            break;
        }
      }
    }
  },
};

module.exports = utils;
