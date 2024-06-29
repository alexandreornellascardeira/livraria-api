import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config({ silent: true });

const uri = process.env.MONGODB_URL; 

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    await mongoClient.connect();
    
  } catch (error) {
    throw error;
  }  

export default mongoClient;