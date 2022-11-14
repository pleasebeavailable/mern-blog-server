const Post = require("../model/post");
const PostComment = require("../model/post_comment");
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

// Post comment method
router.post("/newComment", async (req, res) => {
  const comment = {
    post_id: req.body.postId,
    comment: req.body.comment
  };
  try {

    MongoClient.connect(uri, function (err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("blog-db");
      dbo.collection("comments").insertOne(comment).then(
          result => res.status(200).json(result)).catch(
          err => res.status(400).json({message: err.message}));
    });
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
        res.status(400).send("Error fetching posts!");
      }
      res.json(result);
    })
  })
});

router.route("/getPostComments/:postId").get(async function (req, res) {
  const postId = req.params.postId;
  MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("blog-db");
    dbo.collection("comments").find({post_id: postId}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching posts!");
      }
      console.log(result)
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
