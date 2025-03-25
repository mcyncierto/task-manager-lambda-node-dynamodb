import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "Tasks";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { title, description } = JSON.parse(event.body || "{}");

    if (!title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Title is required" }),
      };
    }

    const task = {
      taskId: uuidv4(),
      title,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await dynamoDb.put({ TableName: TABLE_NAME, Item: task }).promise();

    return { statusCode: 201, body: JSON.stringify(task) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create task" }),
    };
  }
};
