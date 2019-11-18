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
  try {
    const result = await Dynamo.delete(id, tableName).catch(err => {
      console.log("error in Dynamo DELETE", err);
      return null;
    });
    if (!result || !result.Attributes) {
      return Responses._404({
        message: "Failed to delete activation function by id."
      });
    } else {
      return Responses._200({ result });
    }
  } catch (err) {
    console.log(err);
    Responses._400("Something went wrong.");
  }
};
