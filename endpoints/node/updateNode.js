const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

const tableName = "nodes";

module.exports.handler = async event => {
  console.log("event", event);
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: "missing the id from the path." });
  }
  const id = event.pathParameters.id;
  const isExist = await Dynamo.get(id, tableName).catch(err => null);
  if (!isExist) {
    return Responses._404({ message: "not found." });
  } else {
    const body = JSON.parse(event.body);
    const item = {
      weight: body.weight,
      bias: body.bias,
      description: body.description
    };
    const result = await Dynamo.putNode(id, item, tableName).catch(err => {
      console.log("error in Dynamo PUT", err);
      return null;
    });
    if (!result) {
      return Responses._404({
        message: "Failed to update node by id."
      });
    }
    return Responses._200({ result });
  }
};
