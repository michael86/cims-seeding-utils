const axios = require("axios");
const config = require("../config.json");
const queries = require("../modules/mysql/query");

const { runQuery } = require("../modules/mysql/sql");

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
};

module.exports = utils;
