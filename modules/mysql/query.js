const queries = {
  insert: (location, columns) => {
    return `INSERT INTO ${location} (${columns.join(", ")}) VALUES (${columns.map(() => "?")});`;
  },
  selectCompanies: () => `SELECT id FROM companies`,
  selectStock: () =>
    `SELECT id, sku, quantity, price, image_name, free_issue, UNIX_TIMESTAMP(date) AS date from stock`,
  updateSkuDate: () => `UPDATE stock SET date = ? WHERE id = ?`,
  insertLocation: () => `INSERT INTO locations (name, value) VALUES (?, ?)`,
  selectLocation: () => `SELECT id FROM locations WHERE name = ? AND value = ?`,
  selectStockLocations: () => `SELECT location_id AS id FROM stock_locations WHERE stock_id = ?`,
  selectLocationById: () => `SELECT name, value FROM locations WHERE id = ?`,
  insertLocationRelation: () => `INSERT INTO stock_locations (stock_id, location_id) VALUES (?, ?)`,
  insertHistory: () => `INSERT INTO history (sku, quantity, price) VALUES (?, ?, ?)`,
  insertHistorylocationRelation: () =>
    `INSERT INTO history_locations (history_id, location_id) VALUES (?, ?)`,
  selectHistoryLocationRelation: () =>
    `SELECT location_id AS id from history_locations WHERE history_id = ?`,
  updateHistoryDate: () => `UPDATE history SET date_added = ? WHERE id = ?`,
  insertHistoryRelation: () => `INSERT INTO stock_histories (stock_id, history_id) VALUES (?, ?)`,
  patchStock: () => `UPDATE stock SET sku = ?, quantity = ?, price = ? WHERE id = ?`,
  selectHistoryRelations: () => `SELECT history_id AS id from stock_histories WHERE stock_id = ?`,
  selectHistory: () => `SELECT * from history where id = ?`,
};

module.exports = queries;
