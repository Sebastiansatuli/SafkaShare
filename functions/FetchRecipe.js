const { MongoClient, ObjectId } = require("mongodb");

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';

// Connect to database
async function connectToDatabase(uri) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db(DB_NAME);
}

// Handler for fetching a single recipe
exports.handler = async (event) => {
  // Make sure to only process GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const db = await connectToDatabase(MONGODB_URI);
    const collection = db.collection("Resepti");
    const recipeId = event.queryStringParameters.id;

    // Fetch the recipe from the database
    const recipe = await collection.findOne({ _id: ObjectId(recipeId) });

    if (!recipe) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Recipe not found' }) };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from any origin
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from any origin
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
