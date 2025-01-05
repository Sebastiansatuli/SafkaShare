// Importataan tarvittavat moduulit
const { MongoClient } = require('mongodb');

// Jest-testi
describe('MongoDB Connection', () => {
  let mongoClient;

  // Connection string tietokantaan
  const connectionString = 'mongodb+srv://ReseptiAdmin:m3ZUd0g!FL@reseptisovellus.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

  // Testin setup
  beforeAll(async () => {
    // Luodaan yhteys tietokantaan
    mongoClient = new MongoClient(connectionString);

    // Muodostetaan yhteys
    await mongoClient.connect();
  });

  // Yhteydenoton jälkeen suljetaan yhteys
  afterAll(async () => {
    await mongoClient.close();
  });

  // Testataan onko yhteys onnistunut
  it('Saa yhteyden SafkaSharen tietokantaan', async () => {
    expect(mongoClient.topology.isConnected()).toBeTruthy();
  });
});
