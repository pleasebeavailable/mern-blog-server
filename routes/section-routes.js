const Section = require("../model/section");
const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const router = express.Router();
module.exports = router;

const uri = process.env.ATLAS_URI;

// Post Method
router.post("/post", async (req, res) => {
  const sidebar = new Section({
    title: req.body.title, url: req.body.url,
  });
  try {
    const data = await res.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

//Get all Method
router.route("/getAll").get(async function (req, res) {
  MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("blog-db");
    dbo.collection("sections").find({}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching sections!");
      }
      res.json(result);
    })
  })
});
