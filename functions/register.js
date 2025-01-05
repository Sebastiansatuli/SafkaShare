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

// Check if the email already exists in the database
const checkEmailExists = async (db, email) => {
  const collection = db.collection("Käyttäjä"); // Adjust collection name as needed
  const existingUser = await collection.findOne({ email: email });
  return !!existingUser; // Return true if user exists, false otherwise
};

// Insert new user into the database
const insertUser = async (db, user) => {
  const collection = db.collection("Käyttäjä"); // Adjust collection name as needed
  const result = await collection.insertOne(user);
  return result.ops[0]; // Return the inserted user
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
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: 'CORS pre-flight check passed.' }),
    };
  }

  try {
    // Parse incoming data from the request body
    const requestBody = JSON.parse(event.body);

    // Check if required data is present
    if (!requestBody || !requestBody.full_name || !requestBody.email || !requestBody.password) {
      return {
        statusCode: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust for production
        },
        body: JSON.stringify({ message: 'Missing required data' }),
      };
    }

    // Connect to the database
    const db = await connectToDatabase(MONGODB_URI);

    // Check if email already exists
    const emailExists = await checkEmailExists(db, requestBody.email);
    if (emailExists) {
      return {
        statusCode: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust for production
        },
        body: JSON.stringify({ message: 'Email already exists' }),
      };
    }

    // Insert the user into the database
    const insertedUser = await insertUser(db, requestBody);

    return {
      statusCode: 201, // 201 Created
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust for production
      },
      body: JSON.stringify(insertedUser), // Return the inserted user
    };
  } catch (error) {
    console.error('Error accessing the database or inserting data:', error);
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