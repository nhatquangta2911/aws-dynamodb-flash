const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");
const uuid = require("uuid/v4");

const tableName = "layer_transactions";

module.exports.handler = async event => {
  console.log("event", event);
  const body = JSON.parse(event.body);
  let item = {
    _id: uuid(),
    inputLayerId: body.inputLayerId,
    outputLayerId: body.outputLayerId,
    activationFunctionId: body.activationFunctionId
  };
  const result = await Dynamo.post(item, tableName).catch(err => {
    console.log("error in Dynamo POST", err);
    return null;
  });
  if (!result) {
    return Responses._404({ message: "Failed to add the layer nodes" });
  }
  return Responses._200(item);
};
