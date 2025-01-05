const { MongoClient } = require('mongodb');

// Connection URI for MongoDB
const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
    try {
        const { id } = event.queryStringParameters;
        if (!id) {
            throw new Error('Recipe ID is required');
        }

        // Create a new MongoClient
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Connect to MongoDB
        await client.connect();

        // Access the database
        const db = client.db('SafkaShare');

        // Query the database to fetch recipe details by ID
        const recipe = await db.collection('Resepti').findOne({ _id: id });
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        // Close the MongoDB connection
        await client.close();

        return {
            statusCode: 200,
            body: JSON.stringify(recipe)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
