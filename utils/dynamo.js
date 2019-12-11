const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  async getAll(TableName) {
    const params = {
      TableName
    };
    const data = await documentClient.scan(params).promise();
    if (!data || !data.Items) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(data);
    return data.Items;
  },
  async get(id, TableName) {
    const params = {
      TableName,
      Key: {
        _id: id
      },
      ReturnConsumedCapacity: "TOTAL"
    };
    const data = await documentClient.get(params).promise();
    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(data);

    return data.Item;
  },
  async getCurrent(TableName) {
    const params = {
      TableName,
      Limit: 1
    };
    const data = await documentClient.scan(params).promise();
    if (!data || !data.Items) {
      throw Error(`There was an error fetching the data from ${TableName}`);
    }
    console.log(data);
    return data.Items;
  },
  async getByPage(page, TableName) {
    const params = {
      TableName
    };
    const data = await documentClient.scan(params).promise();
    if (!data || !data.Items) {
      throw Error(`There was an error fetching the data from ${TableName}`);
    }
    const orderedData = data.Items.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const result = orderedData.slice((page - 1) * 10, page * 10);
    const response = { result, total: data.Items.length };
    return response;
  },
  async getNodes(layerId, TableName) {
    const params = {
      TableName,
      FilterExpression: "#x = :a",
      ExpressionAttributeNames: {
        "#x": "layerId"
      },
      ExpressionAttributeValues: {
        ":a": layerId
      }
    };
    const data = await documentClient.scan(params).promise();
    if (!data || !data.Items) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    } else {
      console.log(data.Items);
      let ids = data && data.Items && data.Items.map(i => i.nodeId);
      return ids;
    }
  },
  async post(item, TableName) {
    const params = {
      Item: item,
      TableName
    };
    const result = await documentClient.put(params).promise();
    if (!result) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(result);
    return result;
  },
  async putActivationFunction(id, item, TableName) {
    const params = {
      TableName,
      Key: {
        _id: id
      },
      UpdateExpression: `set #a = :x, #b = :y`,
      ExpressionAttributeNames: {
        "#a": "name",
        "#b": "description"
      },
      ExpressionAttributeValues: {
        ":x": item.name,
        ":y": item.description
      },
      ReturnValues: "ALL_NEW"
    };
    const result = await documentClient.update(params).promise();
    if (!result) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(result);
    return result;
  },
  async putNode(id, item, TableName) {
    const params = {
      TableName,
      Key: {
        _id: id
      },
      UpdateExpression: `set #a = :x, #b = :y, #c = :z`,
      ExpressionAttributeNames: {
        "#a": "weight",
        "#b": "bias",
        "#c": "description"
      },
      ExpressionAttributeValues: {
        ":x": item.weight,
        ":y": item.bias,
        ":z": item.description
      },
      ReturnValues: "ALL_NEW"
    };
    const result = await documentClient.update(params).promise();
    if (!result) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(result);
    return result;
  },
  async putTransaction(id, item, TableName) {
    const params = {
      TableName,
      Key: {
        _id: id
      },
      UpdateExpression: `set #a = :x, #b = :y, #c = :z`,
      ExpressionAttributeNames: {
        "#a": "inputLayerId",
        "#b": "outputLayerId",
        "#c": "activationFunctionId"
      },
      ExpressionAttributeValues: {
        ":x": item.inputLayerId,
        ":y": item.outputLayerId,
        ":z": item.activationFunctionId
      },
      ReturnValues: "ALL_NEW"
    };
    const result = await documentClient.update(params).promise();
    if (!result) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(result);
    return result;
  },
  async putLayer(id, item, TableName) {
    const params = {
      TableName,
      Key: {
        _id: id
      },
      UpdateExpression: `set #a = :x, #b = :y`,
      ExpressionAttributeNames: {
        "#a": "name",
        "#b": "type"
      },
      ExpressionAttributeValues: {
        ":x": item.name,
        ":y": item.type
      },
      ReturnValues: "ALL_NEW"
    };
    const result = await documentClient.update(params).promise();
    if (!result) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    }
    console.log(result);
    return result;
  },
  async delete(id, TableName) {
    const params = {
      Key: {
        _id: id
      },
      TableName,
      ReturnValues: "ALL_OLD"
    };
    const result = await documentClient.delete(params).promise();
    if (!result || !result.Attributes) {
      throw Error(
        `There was an error fetching the data for id of ${id} from ${TableName}`
      );
    } else {
      console.log(result);
      return result;
    }
  }
};

module.exports = Dynamo;
