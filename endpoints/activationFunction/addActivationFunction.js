const Responses = require("../../utils/API_Responses");
const Dynamo = require("../../utils/dynamo");
const uuid = require("uuid/v4");
const Joi = require("@hapi/joi");

// const tableName = process.env.tableName;
const tableName = "activationFunctions";

module.exports.handler = async event => {
  console.log("event", event);
  const body = JSON.parse(event.body);
  let item = {
    _id: uuid(),
    name: body.name,
    description: body.description
  };
  try {
    const { error } = schema.validate(item);
    if (error) {
      console.log(error);
      return Responses._404({ error });
    } else {
      const result = await Dynamo.post(item, tableName).catch(err => {
        console.log("error in Dynamo POST", err);
        return null;
      });
      if (!result) {
        return Responses._404({
          message: "Failed to add activation function."
        });
      }
      return Responses._200({ item });
    }
  } catch (err) {
    console.log({ err });
    Responses._400({ error: err });
  }
};

const schema = Joi.object({
  _id: Joi.string()
    .min(36)
    .required(),
  name: Joi.string()
    .min(2)
    .max(30)
    .required(),
  description: Joi.string()
    .min(10)
    .max(1024)
    .default("Update soon")
});
