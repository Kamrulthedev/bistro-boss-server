const cors = require("cors");
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;

// middlwerar
app.use(cors({}));
app.use(express.json());

const uri = `mongodb://localhost:27017`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const todoCollection = client.db("Todo").collection("Task");

    // Cards Collection
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const result = await todoCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const TodoItems = req.body;
      const result = await todoCollection.insertOne(TodoItems);
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await todoCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const todoData = req.body;
      const filter = { _id: new ObjectId(id) };
      const UpdateDoc = {
        $set: {
          title: todoData.title,
          description: todoData.description,
          status: todoData.status,
          property: todoData.property,
          datetime: todoData.datetime
        },
      };
      const result = await todoCollection.updateOne(filter, UpdateDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My Todo Start !!!");
});
app.listen(port, () => {
  console.log(`My Todo start !!${port}`);
});
