const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

const tableName = "layer_transactions";

module.exports.handler = async event => {
  console.log("EVENT", event);
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: "missing the id from the path" });
  }
  const id = event.pathParameters.id;
  const isExist = await Dynamo.get(id, tableName).catch(err => null);
  if (!isExist) {
    return Responses._404({ message: "not found." });
  } else {
    const body = JSON.parse(event.body);
    const item = {
      inputLayerId: body.inputLayerId,
      outputLayerId: body.outputLayerId,
      activationFunctionId: body.activationFunctionId
    };
    const result = await Dynamo.putTransaction(id, item, tableName).catch(
      err => {
        console.log("error in Dynamo PUT", err);
        return null;
      }
    );
    if (!result || !result.Attributes) {
      return Responses._404({ message: "Failed to update by id." });
    }
    return Responses._200({ result });
  }
};
