const queries = {
  insert: (location, columns) => {
    return `INSERT INTO ${location} (${columns.join(", ")}) VALUES (${columns.map(() => "?")});`;
  },
  selectCompanies: () => `SELECT id FROM companies`,
  updateSkuDate: () => `UPDATE stock SET date = ? WHERE id = ?`,
  insertLocation: () => `INSERT INTO locations (name, value) VALUES (?, ?)`,
  selectLocation: () => `SELECT id FROM locations WHERE name = ? AND value = ?`,
  insertLocationRelation: () => `INSERT INTO stock_locations (stock_id, location_id) VALUES (?, ?)`,
};

module.exports = queries;
