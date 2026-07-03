import mongoose from 'mongoose';

const mongoUri = "mongodb+srv://vamsivalluri52_db_user:Vamsi1234@shop.jp7hjro.mongodb.net/shopez?appName=shop";

async function check() {
  console.log("Connecting to MongoDB cluster...");
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");
    
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log("\nCollections in 'shopez' database:");
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - ${col.name}: ${count} documents`);
      }
    }

    // Now connect to default database if no path specified
    console.log("\nDisconnecting and checking default database...");
    await mongoose.disconnect();
    
    const defaultUri = "mongodb+srv://vamsivalluri52_db_user:Vamsi1234@shop.jp7hjro.mongodb.net/?appName=shop";
    await mongoose.connect(defaultUri);
    const dbDefault = mongoose.connection.db;
    console.log(`\nDefault database name: '${mongoose.connection.name}'`);
    if (dbDefault) {
      const collectionsDefault = await dbDefault.listCollections().toArray();
      console.log("Collections in default database:");
      for (const col of collectionsDefault) {
        const count = await dbDefault.collection(col.name).countDocuments();
        console.log(`  - ${col.name}: ${count} documents`);
      }
    }

  } catch (err: any) {
    console.error("Error connecting to database:", err.message);
  }
  process.exit(0);
}

check();
