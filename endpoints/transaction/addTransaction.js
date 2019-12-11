const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");
const uuid = require("uuid/v4");

const tableName = "transactions";

module.exports.handler = async event => {
  console.log("event", event);
  const body = JSON.parse(event.body);
  const today = new Date().toISOString();
  let item = {
    _id: uuid(),
    createdAt: today,
    node1: body.node1,
    node2: body.node2,
    node3: body.node3,
    af1: body.af1,
    af2: body.af2,
    af3: body.af3,
    epochs: body.epochs,
    accuracy: body.accuracy,
    loss: body.loss,
    note: body.note || "NO CONTENT"
  };
  const result = await Dynamo.post(item, tableName).catch(err => {
    console.log("error in Dynamo POST", err);
    return null;
  });
  if (!result) {
    return Responses._404({ message: "Failed to add the transaction." });
  }
  return Responses._200({ item });
};
