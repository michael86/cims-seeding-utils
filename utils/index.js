const axios = require("axios");
const config = require("../config.json");
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
};

module.exports = utils;
