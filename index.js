const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DATABASE_URI;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // created database
    const taskManagerDB = client.db("taskManagerDB");

    const tasksCollection = taskManagerDB.collection("tasks");

    app.get("/", (req, res) => {
      res.send("Task Manager is running");
    });

    app.post("/tasks", async (req, res) => {
      const newTask = req.body;

      try {
        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json(result);
      } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Task Manager is listening on port ${port}`);
});
