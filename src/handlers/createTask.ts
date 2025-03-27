import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SQS } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const sqs = new SQS();
const TASK_QUEUE_URL = process.env.TASK_QUEUE_URL!;

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

    // Send the task to SQS
    const params = {
      QueueUrl: TASK_QUEUE_URL,
      MessageBody: JSON.stringify(task),
    };

    await sqs.sendMessage(params).promise();

    return { statusCode: 201, body: JSON.stringify(task) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not create task: ${error}` }),
    };
  }
};
