const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");

// const tableName = process.env.tableName;
const tableName = "transactions";

module.exports.handler = async event => {
  console.log("event", event);
  if (!event.pathParameters || !event.pathParameters.page) {
    return Responses._400({
      message: "missing the page number from the path."
    });
  }
  const page = event.pathParameters.page;
  const items = await Dynamo.getByPage(page, tableName).catch(err => {
    console.log("error in Dynamo GET", err);
    return null;
  });
  if (!items) {
    return Responses._404({
      message: "Failed to get transactions by page."
    });
  }
  return Responses._200({
    nodes: items.result,
    size: items.result.length,
    total: items.total,
    totalPage:
      items.total % 10 === 0
        ? Math.round(items.total / 10)
        : Math.round(items.total / 10) + 1
  });
};
