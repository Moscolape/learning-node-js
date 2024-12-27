const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://Moscolian:ilovedherin2019@cluster0.cz0tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    _db = client.db("shop");
    return _db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

function getDb() {
  if (!_db) {
    throw new Error("Database not initialized. Call connectToMongoDB first.");
  }
  return _db;
}

module.exports = { connectToMongoDB, getDb };