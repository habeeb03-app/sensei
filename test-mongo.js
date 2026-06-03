const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

async function test() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully!");
    await client.db("sensei").command({ ping: 1 });
    console.log("Ping successful!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

test();
