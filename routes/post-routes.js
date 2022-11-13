const Post = require("../model/post");
const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const router = express.Router();
module.exports = router;

const uri = process.env.ATLAS_URI;

// Post Method
router.post("/post", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    date: req.date,
    description: req.description,
    image: req.image,
    imageLabel: req.imageLabel
  });
  try {
    const data = await res.save(post);
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
    dbo.collection("posts").find({}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching sections!");
      }
      res.json(result);
    })
  })
});

router.route("/section/getAll").post(async function (req, res) {

  MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("blog-db");
    dbo.collection("posts").find({section: req.body.params.section}).toArray(
        function (err, result) {
          console.log(result)
          if (err) {
            res.status(400).send("Error fetching sections!");
          }
          res.json(result);
        })
  })
});
