const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

// const tableName = process.env.tableName;
const tableName = "layer_nodes";

module.exports.handler = async event => {
  console.log("event", event);
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: "missing the id from the path." });
  }
  let id = event.pathParameters.id;
  const items = await Dynamo.getNodes(id, tableName).catch(err => {
    console.log("error in Dynamo GET", err);
    return null;
  });
  if (!items) {
    return Responses._404({
      message: "Failed to get items by id."
    });
  } else {
    let results = [];
    for (let i = 0; i < items.length; i++) {
      results.push(
        await Dynamo.get(items[i], "nodes").catch(err => {
          console.log(err);
          return null;
        })
      );
    }
    return Responses._200({ nodes: results, layerId: id });
  }
};
