import express from "express";
import cors from "cors";
import db from "./database/connectMongo.js";

const app = express();
app.use(cors());
const port = 8080;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//TODO | get all posts in Images
app.get("/", async (req, res) => {
  try {
    const collection = db.collection("images");
    const results = await collection.find({}).toArray();
    res.json(results);
  } catch (err) {
    res.json(err);
  }
});

//TODO | add image to Images
app.post("/uploads", async (req, res) => {
  const { base64Images, collection_id, resolution } = req.body;
  try {
    const collection = db.collection("images");
    await collection.insertOne({
      ...base64Images,
      collection_id,
      resolution,
    });
    res.status(201).json({ collection_id });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//TODO |  add reaction to photo + or -
app.post("/uploads/reactions", async (req, res) => {
  const { collection_id, index, reaction } = req.body;
  const collection = db.collection("reactions");
  const results = await collection.find({ collection_id }).toArray();
  if (results.length !== 0) {
    let reactions = isNaN(results[0][index]) ? 0 : Number(results[0][index]); // check whether reaction to this image is in db, if not then it is 0
    if (reaction === "+") reactions += 1;
    else if (reaction === "-" && reactions > 0) reactions -= 1;
    else reactions = 0;
    const updated = await collection.updateOne(
      { collection_id },
      { $set: { [index]: reactions.toString() } } // updating our new reactions
    );
    res.json(updated);
  } else {
    let feedback = reaction === "+" ? "1" : "0"; // if new collection, feedback 0 or 1 depending on reaction
    const addReaction = await collection.insertOne({
      [index]: feedback,
      collection_id,
    });
    res.json(addReaction);
  }
});

//TODO | get reactions by collection_id
app.get("/reactions/:collection_id", async (req, res) => {
  const collection_id = req.params.collection_id;
  const collection = db.collection("reactions");
  const results = await collection.find({ collection_id }).toArray();
  res.json(results);
});

//TODO | get images by collection_id
app.get("/:collection_id", async (req, res) => {
  const collection_id = req.params.collection_id;
  const collection = db.collection("images");
  try {
    const result = await collection.find({ collection_id }).toArray();
    res.json({ result });
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`);
});
