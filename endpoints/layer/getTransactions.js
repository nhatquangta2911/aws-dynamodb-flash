const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

const tableName = "layer_transactions";

module.exports.handler = async event => {
  console.log("event", event);
  const items = await Dynamo.getAll(tableName).catch(err => {
    console.log("error in Dynamo GET", err);
    return null;
  });
  if (!items) {
    return Responses._404({
      message: "Failed to get all layers."
    });
  }
  const demo = await Dynamo.get(
    items && items[0] && items[0].inputLayerId,
    "layers"
  ).catch(err => {
    console.log(err);
    return null;
  });
  let result = new Array();
  for (let i = 0; i < items.length; i++) {
    result.push({
      _id: items[i]._id,
      inputLayer: await Dynamo.get(items[i].inputLayerId, "layers").catch(
        err => null
      ),
      outputLayer: await Dynamo.get(items[i].outputLayerId, "layers").catch(
        err => null
      ),
      activationFunction: await Dynamo.get(
        items[i].activationFunctionId,
        "activationFunctions"
      ).catch(err => {
        console.log(err);
        return null;
      })
    });
  }
  return Responses._200({
    transactions: result,
    total: items.length
  });
};
