import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

export const handler = async (event) => {
  console.log("Incoming Event:", JSON.stringify(event, null, 2));

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing" }),
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
    console.log("Parsed body:", parsedBody);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  const { name, score } = parsedBody;

  console.log("Name: ", name, "Score: ", score);
  if (!name || typeof score !== "number") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid input. 'name' and 'score' are required." }),
    };
  }

  const params = {
    TableName: "Leaderboard",
    Item: {
      PlayerName: { S: name },
      Score: { N: score.toString() },
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Leaderboard updated successfully." }),
    };
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
