const Post = require("../model/post");
const PostComment = require("../model/post_comment");
const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const {mongo} = require("mongoose");
const router = express.Router();
module.exports = router;

const uri = process.env.ATLAS_URI;

// Post Method
router.post("/createNewPost", async (req, res) => {
  const post = {
    author: req.body.payload.author,
    title: req.body.payload.title,
    description: req.body.payload.description
  };
  try {
    MongoClient.connect(uri, function (err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("blog-db");
      dbo.collection("posts").insertOne(post).then(
          result => res.status(200).json(result)).catch(
          err => res.status(400).json({message: err.message}));
    });
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
    dbo.collection("comments").find({post_id: postId}).toArray(
        function (err, result) {
          if (err) {
            res.status(400).send("Error fetching posts!");
          }
          res.json(result);
        })
  })
});

router.route("/deleteComment/:commentId").delete(async function (req, res) {
  const commentId = req.params.commentId;

  MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("blog-db");
    dbo.collection("comments").deleteOne({_id: mongo.ObjectId(commentId)}).then(
        result => {
          res.status(200).json(result);
        }).catch(
        err => res.status(400).json({message: err.message}));
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
          if (err) {
            res.status(400).send("Error fetching sections!");
          }
          res.json(result);
        })
  })
});
