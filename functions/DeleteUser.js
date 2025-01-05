const { MongoClient, ObjectId } = require("mongodb");

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';

// Function to delete a document by ObjectId
async function deleteDocumentById(collectionName, documentObjectId) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        // Connect to the MongoDB server
        await client.connect();

        // Select the database and collection
        const database = client.db(DB_NAME);
        const collection = database.collection(collectionName);

        console.log(collectionName);
        console.log(documentObjectId);

        // Specify the ObjectId of the document you want to delete
        const documentId = new ObjectId(documentObjectId);
        console.log(documentId);

        // Delete the document based on its ObjectId
        const deleteResult = await collection.deleteOne({ _id: documentId });

        // Check if the deletion was successful
        if (deleteResult.deletedCount === 1) {
            return { message: `Document with ObjectId ${documentId} deleted successfully.` };
        } else {
            throw new Error(`Document with ObjectId ${documentId} not found.`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be caught by the caller
    } finally {
        // Close the connection
        await client.close();
    }
}

// Handler for deleting users
exports.handler = async (event) => {
    // Preflight request handling for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from any origin
                "Access-Control-Allow-Headers": "Content-Type", // Permit Content-Type header
                "Access-Control-Allow-Methods": "DELETE, OPTIONS", // Allow only DELETE and OPTIONS
            },
            body: JSON.stringify({ message: "You can use CORS" }),
        };
    }

    // Make sure to only process DELETE requests
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const requestData = JSON.parse(event.body);

        //Check if the request contains an ID for the user to be deleted
        if (!requestData) {
            throw new Error('User ID is required for deletion.');
        }

        // Call the deleteDocumentById function to delete the user
        const result = await deleteDocumentById("Käyttäjä", requestData);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from any origin
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from any origin
            },
            body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
        };
    }
};