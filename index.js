const cors = require('cors');
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;


// middlwerar
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqeap4x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db("BistroDB").collection("menu");
    const reviewsCollection = client.db("BistroDB").collection("reviews");
    const cardsCollection = client.db("BistroDB").collection("cards");
    const userCollection = client.db("BistroDB").collection("users");




    // users related api 
    app.post('/users', async (req, res) => {
      const user = req.body;
      // insert email if user doesnt exists :
      // you can do this many (1. email unique , 2. upsert 3. simple checking)
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user alredy exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    

    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    app.get('/reviews', async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // Cards Collection
    app.get('/cards', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cardsCollection.find().toArray();
      res.send(result);
    });

    app.post('/cards', async (req, res) => {
      const CardItems = req.body;
      const result = await cardsCollection.insertOne(CardItems);
      res.send(result);
    });

    app.delete('/cards/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cardsCollection.deleteOne(query)
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Boss is sitting')
});
app.listen(port, () => {
  console.log(` Bistro Boss is Sitting on port ${port}`)
});



