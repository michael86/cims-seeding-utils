const { runQuery } = require("../modules/mysql/sql");
const config = require("../config.json");

const statements = require("../modules/mysql/query");

const queries = {
  insertStock: async (item) => {
    try {
      const res = await runQuery(
        statements.insert("stock", ["sku", "quantity", "price", "image_name", "free_issue"]),
        [item.sku, item.quantity, item.price, item.image_name, item.free_issue]
      );
      if (res instanceof Error) throw Error(`insertStock: ${err}`);

      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },

  selectStock: async (addLocations = false) => {
    try {
      let res = await runQuery(statements.selectStock());
      if (res instanceof Error) throw new Error(`selectStock: ${res}`);

      res = addLocations ? queries.addLocations(res) : res;

      return res;
    } catch (err) {
      console.log(err);
    }
  },

  selectHistory: async (id, withLocations = false) => {
    try {
      const relations = await runQuery(statements.selectHistoryRelations(), [id]);
      if (relations instanceof Error) throw new Error(`selectHistory ${data}`);

      const data = [];
      for (const { id } of relations) {
        const history = await runQuery(statements.selectHistory(), [id]);
        if (history instanceof Error) throw new Error(`selectHistory ${history}`);

        if (withLocations) {
          for (const his of history) {
            const locations = await runQuery(statements.selectHistoryLocationRelation(), [his.id]);

            if (locations instanceof Error) throw new Error(`selectHistory ${locations}`);

            his.locations = [];
            for (const { id } of locations) {
              const location = await runQuery(statements.selectLocationById(), [id]);

              for (const entry of location)
                his.locations.push({ name: entry.name, value: entry.value });
            }
          }
        }
        for (const his of history) data.push({ ...his });
      }

      return data;
    } catch (err) {
      console.log(err);
    }
  },

  patchStock: async (data) => {
    try {
      const res = await runQuery(statements.patchStock(), [
        data.sku,
        data.quantity,
        data.price,
        data.id,
      ]);

      if (res instanceof Error) throw new Error(`patchStock ${res}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  addLocations: async (skus) => {
    try {
      for (const item of skus) {
        item.locations = await queries.selectLocations(item.id);
      }
      return skus;
    } catch (err) {
      console.log(err);
    }
  },

  selectLocations: async (id) => {
    try {
      const locations = await runQuery(statements.selectStockLocations(), [id]);
      if (locations instanceof Error) throw new Error(`selectLocations: ${locations}`);

      const data = [];
      for (const location of locations) {
        const values = await runQuery(statements.selectLocationById(), [location.id]);
        if (values instanceof Error) throw new Error(`selectLcoations: ${values}`);
        for (const { name, value } of values) data.push({ name, value });
      }

      return data;
    } catch (err) {
      console.log(err);
    }
  },
  updateSkuDate: async (date, id) => {
    try {
      const res = await runQuery(statements.updateSkuDate(), [date, id]);
      if (res instanceof Error) throw new Error(`updateSkuDate ${res}`);
      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },

  createStockRelation: async (id) => {
    try {
      const res = runQuery(statements.insert("user_stock", ["user_id", "stock_id"]), [
        config.userId,
        id,
      ]);
      if (res instanceof Error) throw new Error(`createStockRelation ${res}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  createStockCompanyRelation: async (id, companyId) => {
    try {
      const res = await runQuery(statements.insert("stock_company", ["stock_id", "company_id"]), [
        id,
        companyId,
      ]);

      if (res instanceof Error) throw new Error(`createStockCompanyrelation ${res}`);
    } catch (err) {
      console.log(err);
    }
  },

  insertLocation: async (location, returnIfExists = false) => {
    try {
      let res = await runQuery(statements.insertLocation(), [location.name, location.value]);
      if (res instanceof Error) throw new Error(`insertLocation ${res}`);

      if (res === "ER_DUP_ENTRY" && returnIfExists)
        res = await runQuery(statements.selectLocation(), [location.name, location.value]);

      return res.insertId || res[0].id;
    } catch (err) {
      console.log(err);
    }
  },
  insertLocationRelation: async (id, location) => {
    console.log(`creating location relation \nid: ${id}\nloationId: ${location}`);
    try {
      const res = await runQuery(statements.insertLocationRelation(), [id, location]);
      if (res instanceof Error) throw new Error(`insertLocationRelation: ${res}`);
      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },
  insertHistory: async (data) => {
    try {
      const res = await runQuery(statements.insertHistory(), [data.sku, data.quantity, data.price]);

      if (res instanceof Error) throw new Error(`insertHistory ${res}`);
      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },
  updateHistoryDate: async (date, id) => {
    try {
      const res = runQuery(statements.updateHistoryDate(), [date, id]);
      if (res instanceof Error) throw new Error(`updateHistoryDate ${res}`);
      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },
  insertHistoryRelation: async (stockId, hisId) => {
    try {
      const res = runQuery(statements.insertHistoryRelation(), [stockId, hisId]);
      if (res instanceof Error) throw new Error(`insertHistoryRelation ${res}`);
      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },

  insertHistorylocationRelation: async (hisId, locId) => {
    try {
      const res = runQuery(statements.insertHistorylocationRelation(), [hisId, locId]);
      if (res instanceof Error) throw new Error(`insertHistorylocationRelation ${res}`);
      return res.insertId;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = queries;
