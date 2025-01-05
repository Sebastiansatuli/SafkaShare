const { MongoClient } = require("mongodb");

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';

// Connect to database
async function connectToDatabase(uri) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db(DB_NAME);
}

// Handler
exports.handler = async (event) => {
  // Preflight request handling for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from any origin
        "Access-Control-Allow-Headers": "Content-Type", // Permit Content-Type header
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allow only GET, POST, and OPTIONS
      },
      body: JSON.stringify({ message: "You can use CORS" }),
    };
  }

  // Make sure to only process POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const db = await connectToDatabase(MONGODB_URI);
    const collection = db.collection("Resepti");
    const recipe = JSON.parse(event.body);
    const result = await collection.insertOne(recipe);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from any origin
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.ops[0]),
    };
  } catch (error) {
    console.error('Error adding recipe:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from any origin
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
