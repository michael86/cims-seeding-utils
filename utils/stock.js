const config = require("../config.json");
const queries = require("./queries");
const utils = require("./index");
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

const stock = {
  generate: async () => {
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
  createLocations: async (id, createRelation = false) => {
    console.log("generating locations for stock id: ", id);

    const count = Math.floor(Math.random() * 5) + 1;
    const ids = [];
    for (let i = 0; i < count; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];

      const res = await queries.insertLocation(location, true);

      createRelation && (await queries.insertLocationRelation(id, res));

      ids.push(res);
    }

    return ids;
  },

  createHistory: async (data, stockId, locationIds = []) => {
    try {
      console.log(`creating history snapshot for ${data.sku}`);

      const res = await queries.insertHistory(data);
      await queries.updateHistoryDate(data.date, res);
      await queries.insertHistoryRelation(stockId, res);

      for (const location of locationIds)
        await queries.insertHistorylocationRelation(res, location);
    } catch (err) {
      console.log(err);
    }
  },

  insertStock: async (data, companies) => {
    console.log("inserting stock and creating relations");
    try {
      for (const item of data) {
        console.log("inserting ", item.sku);

        const res = await queries.insertStock(item);

        await queries.updateSkuDate(item.date, res);

        await queries.createStockRelation(res);

        await queries.createStockCompanyRelation(
          res,
          companies[Math.floor(Math.random() * companies.length)]
        );

        const locationIds = await stock.createLocations(res, true);

        await stock.createHistory(item, res, locationIds);
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
            item.price = utils.getRandomNumberInRange(0, 100000);
            break;
          case 2:
            item.quantity = utils.getRandomNumberInRange(0, 999999);
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

module.exports = stock;
