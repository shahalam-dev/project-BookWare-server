const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


// use middleware
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxuch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// const bookData = {
//   title: "The Power of Habit",
//   author: "Charles Duhigg",
//   category: "Self-help and meditation",
//   suppler: "RH Books",
//   price: "1078",
//   quantity: "26"
// }

async function run() {
  try {
    await client.connect();
    const collection = client.db("warehouse").collection("books-stock");
    // create a document to insert
    
    const result = await collection.insertOne(bookData);
    console.log(`A book was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("hello form server");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
