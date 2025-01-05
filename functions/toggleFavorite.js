// functions/toggleFavorite.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  // Define CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Adjust this to match the domain of your front-end app in production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow only POST and OPTIONS methods
    'Content-Type': 'application/json',
  };

  // Handle preflight request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers,
      body: '', // No content for preflight response
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: 'Method Not Allowed' 
    };
  }

  try {
    const { userId, recipeId } = JSON.parse(event.body);
    await client.connect();
    const database = client.db('SafkaShare');
    const favorites = database.collection('Suosikit');

    // Check if the recipe is already a favorite
    const favorite = await favorites.findOne({ userId, recipeId });
    let isFavorite = false; // Flag to track favorite status
    
    if (favorite) {
      // If it exists, remove it
      await favorites.deleteOne({ _id: favorite._id });
    } else {
      // If not, add it as a new favorite
      await favorites.insertOne({ userId, recipeId });
      isFavorite = true; // Since we're adding it, it's now a favorite
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ isFavorite: isFavorite }),
    };
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    return { 
      statusCode: 500, 
      headers,
      body: 'Internal Server Error' 
    };
  } finally {
    await client.close();
  }
};
