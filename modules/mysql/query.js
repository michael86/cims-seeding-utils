const queries = {
  insert: (location, columns) => {
    return `INSERT INTO ${location} (${columns.join(
      ", "
    )}) VALUES (${columns.map(() => "?")});`;
  },
};

module.exports = queries;
