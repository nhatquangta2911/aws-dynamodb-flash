const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

// const tableName = process.env.tableName;
const tableName = "transactions";

module.exports.handler = async event => {
  console.log("event", event);
  const items = await Dynamo.getLatest(tableName).catch(err => {
    console.log("error in Dynamo GET", err);
    return null;
  });
  if (!items) {
    return Responses._404({
      message: "Failed to get all transactions."
    });
  }
  return Responses._200({ nodes: items, total: items.length });
};
