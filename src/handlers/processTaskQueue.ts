import { SQSEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "Tasks";

export const handler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const task = JSON.parse(record.body);

      await dynamoDb.put({ TableName: TABLE_NAME, Item: task }).promise();
      console.log(`Task saved: ${task.taskId}`);
    }

    return { statusCode: 200 };
  } catch (error) {
    console.error("Error processing tasks:", error);
    throw new Error("Failed to process task queue");
  }
};
