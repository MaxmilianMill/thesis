import { Db, MongoClient } from 'mongodb';

let dbInstance: Db;
let mongoClient: MongoClient;

export async function connectDB() {
  if (dbInstance) return;

  const uri = process.env.MONGODB_URI || "";
  const dbName = process.env.MONGODB_NAME || "";

  console.log("URI ", uri);
  console.log("DB NAME ", dbName);
  
  try {

    mongoClient = new MongoClient(uri, {autoSelectFamily: false});
    
    await mongoClient.connect();
    
    dbInstance = mongoClient.db(dbName); 
    
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);
    process.exit(1); // Stop the server if the DB is down
  }
};

export function getDB() {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbInstance;
};

export async function closeDB() {
  if (mongoClient) {
    await mongoClient.close();
    console.log("MongoDB connection closed.");
  }
};

await connectDB();