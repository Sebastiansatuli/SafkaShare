/*const { MongoClient } = require('mongodb');

// Connection URI (Uniform Resource Identifier)
const uri = 'mongodb://localhost:27017/SafkaShare';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to the database');

    // You can now perform database operations here

  } finally {
    // Ensure that the client will be closed
    await client.close();
  }
}

// Call the function to connect to the database
connectToDatabase(); */




const { MongoClient, ObjectId } = require('mongodb');

// Connection URI for Azure Cosmos DB MongoDB API
const uri = 'mongodb+srv://ReseptiAdmin:m3ZUd0g!FL@reseptisovellus.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

// Database and collection names
const dbName = 'SafkaShare';
const collectionKayttaja = 'Käyttäjä';
const collectionResepti = 'Resepti';
const collectionArvostelu = 'Arvostelu';
const collectionSalasananNollaus = 'Salasanan Nollaus';
const collectionSessio = 'Sessio';
const collectionSuosikit = 'Suosikit';

// Example of a document to be inserted into collection: "Käyttäjä"
const documentKayttaja = { 
  name: 'Erkki',
  full_name: 'Erkki Esimerkki',
  email: 'Erkki.Esimerkki@example.com',
  password: 'Salasana1234',
  user_type: 'user',
};

// Example of a document to be inserted into collection: "Arvostelu"
const documentArvostelu = { 
  title: 'Leipä', 
  infredients: 'jauho, vesi', 
  instructions: 'Sekoita aineet ja laita uuniin', 
  image_url: 'tähän tulee kuvan url', 
  keywords: 'Helppo, Maukas, Kova kuin kivi', 
  visibility: 'public',
};

// Example of target for a query
const queryTarget = {name:'Erkki'};
const queryTargetField = '_id';

const queryTargetUser = {name:'Matti'};
const queryTargetRecipe = {title:'Omenapiirakka'};
const queryTargetId = {ObjectId: ''}



// hakee kaikki valitun kokoelman tiedot ja tulostaa ne konsolille
async function connectAndQuery(collectionName) {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Accessing the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Example query - find all documents in the collection
        const documents = await collection.find({}).toArray();
        console.log('Documents:', documents);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

// hakee valitusta kokoelmasta halutun asian
async function connectAndQueryTarget(collectionName, queryTarget) {
  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB server
      await client.connect();
      console.log('Connected to the database');

      // Accessing the database and collection
      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      // Example query - find all documents in the collection
      const documents = await collection.find(queryTarget).toArray();
      console.log('Documents:', documents);
  } catch (error) {
      console.error('Error:', error);
  } finally {
      // Close the connection
      await client.close();
      console.log('Connection closed');
  }
}



// lisää valittuun tauluun halutun dokumentin
async function connectAndInsert(collectionName, documentContent) {
  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB server
      await client.connect();
      console.log('Connected to the database');

      // Accessing the database and collection
      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      // Insert the document into the collection
      const result = await collection.insertOne(documentContent);
      console.log('Document added:', result.insertedId);
  } catch (error) {
      console.error('Error:', error);
  } finally {
      // Close the connection
      await client.close();
      console.log('Connection closed');
  }
}

// hakee valitusta kokoelmasta halutun asian ja lisää haluttuun tauluun dokumentin
async function connectAndAddRecipeToUser(queryTarget, queryTargetField, collectionNameTarget) {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Accessing the database and collection
        const database = client.db(dbName);
        const collectionQuery = database.collection('Käyttäjä');
        const collectionInsert = database.collection(collectionNameTarget);

        // Example query - find all documents in the collection
        //const projection = {};
        //projection[queryTargetField] = 1;
        const documents = await collectionQuery.find(queryTarget).toArray();

        // Get the first field value
        const firstFieldValue = documents.length > 0 ? documents[0][queryTargetField] : null;
        const userId = firstFieldValue.toString();

        // Return the first field value
        //return firstFieldValue;

        // Insert the document into the collection
        const documentResepti = { 
            user_id: userId,
            title: 'Omenapiirakka', 
            ingredients: 'omena, jauho, vesi', 
            instructions: 'Sekoita aineet ja laita uuniin', 
            image_url: 'tähän tulee kuvan url', 
            keywords: 'Helppo, Maukas, Omenainen', 
            visibility: 'private',
          };

            const result = await collectionInsert.insertOne(documentResepti);
            console.log('Document added:', result.insertedId);

          //console.log(documentResepti);
        
        //console.log('Id:', firstFieldValue.toString()); // id tulostuu onnistuneesti konsolille -----------------------------------------------------------------------------

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

// lisää arvostelun käyttäjälle x reseptiin y
async function connectAndAddReviewToUser(queryTargetUser, queryTargetRecipe, queryTargetField, collectionNameTarget) {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Accessing the database and collection
        const database = client.db(dbName);
        const collectionQueryKayttaja = database.collection('Käyttäjä');
        const collectionQueryResepti = database.collection('Resepti');
        const collectionInsert = database.collection(collectionNameTarget);

        // Example query - find all documents in the collection
        //const projection = {};
        //projection[queryTargetField] = 1;
        const documentsKayttaja = await collectionQueryKayttaja.find(queryTargetUser).toArray();
        const documentsResepti = await collectionQueryResepti.find(queryTargetRecipe).toArray();

        // Get the first field value from both querys
        const firstFieldValueKayttaja = documentsKayttaja.length > 0 ? documentsKayttaja[0][queryTargetField] : null;
        const userId = firstFieldValueKayttaja.toString();

        const firstFieldValueResepti = documentsResepti.length > 0 ? documentsResepti[0][queryTargetField] : null;
        const recipeId = firstFieldValueResepti.toString();

        // Return the first field value
        //return firstFieldValue;

        const currentTime = new Date();

        // Insert the document into the collection
        const documentArvostelu = { 
            user_id: userId,
            recipe_id: recipeId, 
            rating: 9, 
            comment: 'Ihan ok', 
            timestamp: currentTime
          };

            const result = await collectionInsert.insertOne(documentArvostelu);
            console.log('Document added:', result.insertedId);

          //console.log(documentArvostelu);
        
        //console.log('Id:', firstFieldValue.toString()); // id tulostuu onnistuneesti konsolille -----------------------------------------------------------------------------

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

async function connectAndAddFavoriteToUser(queryTargetUser, queryTargetRecipe, queryTargetField, collectionNameTarget) {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Accessing the database and collection
        const database = client.db(dbName);
        const collectionQueryKayttaja = database.collection('Käyttäjä');
        const collectionQueryResepti = database.collection('Resepti');
        const collectionInsert = database.collection(collectionNameTarget);

        // Example query - find all documents in the collection
        //const projection = {};
        //projection[queryTargetField] = 1;
        const documentsKayttaja = await collectionQueryKayttaja.find(queryTargetUser).toArray();
        const documentsResepti = await collectionQueryResepti.find(queryTargetRecipe).toArray();

        // Get the first field value from both querys
        const firstFieldValueKayttaja = documentsKayttaja.length > 0 ? documentsKayttaja[0][queryTargetField] : null;
        const userId = firstFieldValueKayttaja.toString();

        const firstFieldValueResepti = documentsResepti.length > 0 ? documentsResepti[0][queryTargetField] : null;
        const recipeId = firstFieldValueResepti.toString();

        // Return the first field value
        //return firstFieldValue;

        // Insert the document into the collection
        const documentSuosikki = { 
            user_id: userId,
            recipe_id: recipeId, 
          };

            const result = await collectionInsert.insertOne(documentSuosikki);
            console.log('Document added:', result.insertedId);

          //console.log(documentArvostelu);
        
        //console.log('Id:', firstFieldValue.toString()); // id tulostuu onnistuneesti konsolille -----------------------------------------------------------------------------

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

// Function to delete a document by ObjectId
async function deleteDocumentById(collectionName, documentObjectId) {
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Select the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Specify the ObjectId of the document you want to delete
        const documentId = new ObjectId(documentObjectId);

        // Delete the document based on its ObjectId
        const deleteResult = await collection.deleteOne({ _id: documentId });

        // Check if the deletion was successful
        if (deleteResult.deletedCount === 1) {
            console.log(`Document with ObjectId ${documentId} deleted successfully.`);
        } else {
            console.log(`Document with ObjectId ${documentId} not found.`);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}

// Function to retrieve only document IDs
async function getDocumentIds(collectionName, queryTarget) {
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB server
        await client.connect();

        // Select the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Find all documents and project to include only the _id field
        let cursor;
        let printout;

        // if query target is defined, returns a string else returns an array
        if (queryTarget) {
            cursor = collection.find(queryTarget, { projection: { _id: 1 } });

            // Convert cursor to array and extract document IDs
            const documentIds = await cursor.toArray();
            printout = documentIds.map(doc => doc._id).toString();

        } else {
            cursor = collection.find({}, { projection: { _id: 1 } });

            // Convert cursor to array and extract document IDs
            const documentIds = await cursor.toArray();
            printout = documentIds.map(doc => doc._id);
        }

        

        // Convert cursor to array and extract document IDs
        //const documentIds = await cursor.toArray();
       // const printout = documentIds.map(doc => doc._id).toString();

        // Log the document IDs
        console.log('Document IDs:', printout);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}

async function connectAndAddSessionToUser(queryTarget, queryTargetField, collectionNameTarget) {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Accessing the database and collection
        const database = client.db(dbName);
        const collectionQuery = database.collection('Käyttäjä');
        const collectionInsert = database.collection(collectionNameTarget);

        // Example query - find all documents in the collection
        //const projection = {};
        //projection[queryTargetField] = 1;
        const documents = await collectionQuery.find(queryTarget).toArray();

        // Get the first field value
        const firstFieldValue = documents.length > 0 ? documents[0][queryTargetField] : null;
        const userId = firstFieldValue.toString();

        // Return the first field value
        //return firstFieldValue;

        // Insert the document into the collection
        const documentResepti = { 
            user_id: userId,
            title: 'Omenapiirakka', 
            ingredients: 'omena, jauho, vesi', 
            instructions: 'Sekoita aineet ja laita uuniin', 
            image_url: 'tähän tulee kuvan url', 
            keywords: 'Helppo, Maukas, Omenainen', 
            visibility: 'private',
          };

            const result = await collectionInsert.insertOne(documentResepti);
            console.log('Document added:', result.insertedId);

          //console.log(documentResepti);
        
        //console.log('Id:', firstFieldValue.toString()); // id tulostuu onnistuneesti konsolille -----------------------------------------------------------------------------

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}


// Call the function to delete the document
deleteDocumentById(collectionKayttaja, '66028ae1d6fddf73e23e8b1e'); //poistaa documentin document_id:n avulla
//getDocumentIds(collectionKayttaja, queryTarget); //Hakee kaikki id:t kokoelmasta x tai yhdestä dokumentista y

// Call the function to connect and perform queries
//connectAndQuery(collectionKayttaja); // Hakee kokoelman käyttäjä tiedot
//connectAndQuery(collectionResepti); // Hakee kokoelman resepti tiedot
//connectAndQuery(collectionArvostelu); // Hakee kokoelman arvostelu tiedot
//connectAndQuery(collectionSuosikit); // Hakee kokoelman suosikit tiedot
//connectAndQueryTarget(collectionKayttaja, queryTarget); // Hakee henkilön y tiedot kokoelmasta x
//connectAndInsert(collectionKayttaja, documentKayttaja); // Lisää kokoelmaan x dokumentin y
//connectAndAddRecipeToUser(queryTarget, queryTargetField, collectionResepti); // Lisää uuden reseptin y henkilölle x
//connectAndAddReviewToUser(queryTargetUser, queryTargetRecipe, queryTargetField, collectionArvostelu); // Lisää uuden arvostelun henkilolle x reseptiin y
//connectAndAddFavoriteToUser(queryTargetUser, queryTargetRecipe, queryTargetField, collectionSuosikit);
//connectAndAddSessionToUser(queryTarget, queryTargetField, collectionNameTarget);

//connectAndQuery(collectionResepti); // hakee kokoelman tiedot ja tulostaa ne konsolille

// Export the function to use it in other files
//module.exports = connectAndQuery;
//module.exports = connectAndInsert;

