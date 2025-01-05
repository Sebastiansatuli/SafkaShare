const { MongoClient, ObjectId } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';
let cachedDb = null;

// Connect to the MongoDB database
const connectToDatabase = async (uri) => {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
  cachedDb = client.db(DB_NAME);
  return cachedDb;
};

// Validate if the string is a valid ObjectId
const isValidObjectId = (id) => ObjectId.isValid(id);

// Query the database for recipes, with optional ID
const queryDatabase = async (db, id = null) => {
  let query = {};
  if (id) {
    query = { _id: new ObjectId(id) };
  }
  const collection = db.collection("Käyttäjä");
  const result = id ? await collection.findOne(query) : await collection.find({}).toArray();
  return result;
};

// Lambda handler
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Handle pre-flight requests
  if (event.httpMethod === 'OPTIONS') {
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
    const id = event.queryStringParameters ? event.queryStringParameters.id : null;
    
    if (id && !isValidObjectId(id)) {
      return {
        statusCode: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust for production
        },
        body: JSON.stringify({ message: 'Invalid ID format' }),
      };
    }
  
    const db = await connectToDatabase(MONGODB_URI);
    const result = await queryDatabase(db, id);
  
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust for production
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error accessing the database or fetching data:', error);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust for production
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};