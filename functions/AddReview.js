const { MongoClient, ObjectId } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';
let cachedDb = null;

// Connect to the MongoDB database
const connectToDatabase = async (uri) => {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  cachedDb = client.db(DB_NAME);
  return cachedDb;
};

// Validate if the string is a valid ObjectId
const isValidObjectId = (id) => ObjectId.isValid(id);

// Query the database for reviews, with optional recipeId
const queryReviews = async (db, recipeId = null) => {
  let query = {};
  if (recipeId && isValidObjectId(recipeId)) {
    query = { recipe_id: new ObjectId(recipeId) };
  }
  const collection = db.collection("Arvostelu"); // Adjust the collection name as per your schema
  const result = await collection.find(query).toArray();
  return result;
};

// Add a new review to the database
const addReview = async (db, reviewData) => {
  const collection = db.collection("Arvostelu"); // Adjust the collection name as per your schema
  const result = await collection.insertOne(reviewData);
  return result.ops[0];
};

// Lambda handler
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.httpMethod === 'OPTIONS') { // Handle CORS pre-flight
    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust for production
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: 'CORS pre-flight check passed.' }),
    };
  }

  try {
    const db = await connectToDatabase(MONGODB_URI);
    if (event.httpMethod === 'POST') { // Add review
      const reviewData = JSON.parse(event.body);
      // Assuming user_id is provided in reviewData
      //reviewData.user_id = "user_id"; // Replace "USER_ID" with the actual user id
      const result = await addReview(db, reviewData);
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", 
        },
        body: JSON.stringify(result),
      };
    } else if (event.httpMethod === 'GET') { // Fetch reviews
      const recipeId = event.queryStringParameters ? event.queryStringParameters.recipeId : null;
      const result = await queryReviews(db, recipeId);
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(result),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};