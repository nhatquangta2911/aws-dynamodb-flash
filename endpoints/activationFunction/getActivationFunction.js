const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

// const tableName = process.env.tableName;
const tableName = "activationFunctions";

module.exports.handler = async event => {
  console.log("event", event);
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: "missing the id from the path." });
  }
  let id = event.pathParameters.id;
  const activationFunction = await Dynamo.get(id, tableName).catch(err => {
    console.log("error in Dynamo GET", err);
    return null;
  });
  if (!activationFunction) {
    return Responses._404({
      message: "Failed to get activation function by id."
    });
  }
  return Responses._200({ activationFunction });
};
