const { MongoClient, ObjectId } = require("mongodb");

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'SafkaShare';

// Function to update a recipe by its ObjectId
async function updateRecipeById(recipeId, updatedData) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        // Connect to the MongoDB server
        await client.connect();

        // Select the database and collection
        const database = client.db(DB_NAME);
        const collection = database.collection('Resepti');

        // Specify the ObjectId of the recipe you want to update
        const recipeObjectId = new ObjectId(recipeId);

        // Update the recipe based on its ObjectId
        const updateResult = await collection.findOneAndUpdate(
            { _id: recipeObjectId },
            { $set: updatedData },
            { returnOriginal: false } // Return the updated document
        );

        // Check if the update was successful
        if (updateResult.value) {
            return { message: `Recipe with ObjectId ${recipeObjectId} updated successfully.`, updatedRecipe: updateResult.value };
        } else {
            throw new Error(`Recipe with ObjectId ${recipeObjectId} not found.`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be caught by the caller
    } finally {
        // Close the connection
        await client.close();
    }
}

// Handler for updating recipes
exports.handler = async (event) => {
    // Preflight request handling for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from any origin
                "Access-Control-Allow-Headers": "Content-Type", // Permit Content-Type header
                "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow only POST and OPTIONS
            },
            body: JSON.stringify({ message: "You can use CORS" }),
        };
    }

    // Make sure to only process POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const requestData = JSON.parse(event.body);

        // Check if the request contains an ID and updated data for the recipe to be updated
        if (!requestData._id || !requestData.updatedData) {
            throw new Error('Recipe ID and updated data are required for updating.');
        }

        const result = await updateRecipeById(requestData._id, requestData.updatedData);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from any origin
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error('Error updating recipe:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow from any origin
            },
            body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
        };
    }
};
