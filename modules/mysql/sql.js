const asyncMySQL = require("./connection");

module.exports.runQuery = async (query, data) => {
  try {
    const res = await asyncMySQL(query, data);

    if (res.affectedRows === 0) {
      console.log("runQuery error", res);
      return;
    }

    return res;
  } catch (err) {
    console.error(err);
  }
};
