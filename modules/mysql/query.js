const queries = {
  insert: (location, columns) => {
    return `INSERT INTO ${location} (${columns.join(", ")}) VALUES (${columns.map(() => "?")});`;
  },
  selectCompanies: () => `SELECT id FROM companies`,
  selectStock: () => `SELECT * from stock`,
  updateSkuDate: () => `UPDATE stock SET date = ? WHERE id = ?`,
  insertLocation: () => `INSERT INTO locations (name, value) VALUES (?, ?)`,
  selectLocation: () => `SELECT id FROM locations WHERE name = ? AND value = ?`,
  insertLocationRelation: () => `INSERT INTO stock_locations (stock_id, location_id) VALUES (?, ?)`,
  insertHistory: () => `INSERT INTO history (sku, quantity, price) VALUES (?, ?, ?)`,
  insertHistorylocationRelation: () =>
    `INSERT INTO history_locations (history_id, location_id) VALUES (?, ?)`,
  updateHistoryDate: () => `UPDATE history SET date_added = ? WHERE id = ?`,
  insertHistoryRelation: () => `INSERT INTO stock_histories (stock_id, history_id) VALUES (?, ?)`,
};

module.exports = queries;
