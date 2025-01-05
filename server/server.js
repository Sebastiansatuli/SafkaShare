// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

// Lisätty autetikointia varten
const bodyParser = require('body-parser');

const app = express();

// Middleware (Lisätty autentikointia varten)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Lisätty autetikointia varten
const dbName = 'SafkaShare';
let db, usersCollection;

// Connection URI for MongoDB
const uri = 'mongodb+srv://ReseptiAdmin:m3ZUd0g!FL@reseptisovellus.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/*
// Obtain database name and contents (Lisätty autentikointia varten)
client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');

    db = client.db(dbName);
    usersCollection = db.collection('Käyttäjä');
});

// Route for user registration (Lisätty autentikointia varten)
app.post('/register', async (req, res) => {
    const { username, full_name, email, password, user_type } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await db.collection('Käyttäjä').findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Insert new user into the database
        await db.collection('Käyttäjä').insertOne({ username, full_name, email, password, user_type });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for user login (Lisätty autentikointia varten)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await db.collection('Käyttäjä').findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
*/

/*
// Serve static files from 'public' directory
app.use(express.static('public'));

// Start Express server
async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
       process.exit(1); // Exit with failure
   }
}

// Start server after connecting to MongoDB
startServer();
*/

// Export the Express app
module.exports = app;
