import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "Tasks";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { taskId } = event.pathParameters || {};

  if (!taskId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Task ID is required" }),
    };
  }

  try {
    const result = await dynamoDb
      .get({ TableName: TABLE_NAME, Key: { taskId } })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    return { statusCode: 200, body: JSON.stringify(result.Item) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not fetch task: ${error}` }),
    };
  }
};
