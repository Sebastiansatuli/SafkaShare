const { MongoClient, ObjectId } = require("mongodb");

// Assume these are set in your environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';

async function connectToDatabase(uri) {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    return client.db(DB_NAME);
}

async function fetchUserDetails(db, userId) {
    const collection = db.collection("Käyttäjä");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    return user;
}

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    const userId = event.queryStringParameters.userId;

    if (!userId) {
        return { statusCode: 400, body: JSON.stringify({ message: 'User ID is required' }) };
    }

    try {
        const db = await connectToDatabase(MONGODB_URI);
        const userDetails = await fetchUserDetails(db, userId);

        if (!userDetails) {
            return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userDetails),
        };
    } catch (error) {
        console.error('Error fetching user details:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};
