const asyncMySQL = require("./connection");

module.exports.runQuery = async (query, data) => {
  try {
    const res = await asyncMySQL(query, data);

    if (res.affectedRows === 0) {
      return;
    }

    return res;
  } catch (err) {
    return err.code;
  }
};
