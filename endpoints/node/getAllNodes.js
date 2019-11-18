const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

// const tableName = process.env.tableName;
const tableName = "nodes";

module.exports.handler = async event => {
  console.log("event", event);
  const items = await Dynamo.getAll(tableName).catch(err => {
    console.log("error in Dynamo GET", err);
    return null;
  });
  if (!items) {
    return Responses._404({
      message: "Failed to get all nodes."
    });
  }
  return Responses._200({ nodes: items, total: items.length });
};
