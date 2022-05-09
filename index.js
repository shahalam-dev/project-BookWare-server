const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// use middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next){
      const authHeader = req.headers.authorization;
      if(!authHeader){
        return res.status(401).send({message: 'unautorized access'});
      }
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
          return res.status(403).send({message: 'Forbidden access'})
        }
        req.decoded = decoded;
      })
      
      next();
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxuch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



async function run() {
  try {
    await client.connect();
    const collection = client.db("warehouse").collection("books-stock");
    
    // Auth
    app.post('/login', async(req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        res.send({accessToken});
    })

   
    // insert a data

    app.post("/book", async(req, res) => {
      const bookData = {
        bookTitle: req.body.bookTitle,
        authorName: req.body.authorName,
        photoUrl: req.body.photoUrl,
        publisher: req.body.publisher,
        stockQuantity: parseInt(req.body.stockQuantity),
        bookPrice: parseInt(req.body.bookPrice),
        inventoryManager: req.body.inventoryManager
      }
      const result = await collection.insertOne(bookData);
      res.json(result)
      console.log(`A book was inserted with the _id: ${result.insertedId}`);
    })

    // homepage all data

    app.get("/homepage/books/", async(req, res) => {
      
      const query = {};
      const cursor = collection.find(query).limit(6);
      const books = await cursor.toArray();
      res.send(books);
    })



  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello form server");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
