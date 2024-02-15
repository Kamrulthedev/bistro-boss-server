const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config()
const dotenv = require('dotenv')
const port = process.env.PORT || 5000;


// middlwerar
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqeap4x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const menuCollection = client.db("BistroDB").collection("menu")
    const reviewsCollection = client.db("BistroDB").collection("reviews")
    const CardsCollection = client.db("BistroDB").collection("Cards")


    app.get('/menu', async(req, res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })

    app.get('/reviews', async(req, res)=>{
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })

    // Cards Collection
    app.get('Cards', async(req, res)=>{
      const CardItems = req.body;
      const result  = await CardsCollection.insertOne(CardItems);
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
app.listen(port, ()=>{
    console.log(` Bistro Boss is Sitting on port ${port}`)
} )



