const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const auth = require('../middleware/verify-token')
const {MongoClient} = require("mongodb");
module.exports = router;

const uri = process.env.ATLAS_URI;

router.post('/register', (req, res) => {
  const {username, email, password} = req.body.user;
  MongoClient.connect(uri, async (err, db) => {
    if (err) {
      throw err;
    }
    var dbo = db.db("blog-db");
    dbo.collection("users").findOne({email: email}).then(
        async response => {
          if (response) {
            return res.status(200).json({msg: 'Email already exists'});
          }
          // create new user
          var user = {
            username, email, password,
          };
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          result = dbo.collection("users").insertOne(user);
          // return jwt
          const payload = {
            user: {
              id: user.id,
            },
          };

          jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7 days'},
              (err, token) => {
                if (err) {
                  throw err;
                }
                return res.json({token, success: true});
              });

        })
    .catch(err => console.log(err))
  })
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body.user.payload;
  // check if the user exists
  try {
    MongoClient.connect(uri, async (err, db) => {
      if (err) {
        throw err;
      }
      var dbo = db.db("blog-db");
      dbo.collection("users").findOne({email: email}).then(
          async response => {
            if (response == null) {
              return res.status(200).json({msg: 'User does not exist'});
            }
            // check is the encrypted password matches
            const isMatch = await bcrypt.compare(password, response.password);
            if (!isMatch) {
              return res.status(400).json({msg: 'Email or password incorrect'});
            }

            // return jwt
            const payload = {
              user: {
                id: response.id,
              },
            };

            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30 days'},
                (err, token) => {
                  if (err) {
                    throw err;
                  }
                  res.json({token: token, success: true, user: response});
                });
          })
      .catch(err => console.log(err))
    })

  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error.");
  }
});

router.route('/user/info', auth, async (req, res) => {
  MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var dbo = db.db("blog-db");
    dbo.collection("users").find({_id: req.user.id})(function (err, result) {
      if (err) {
        res.status(400).send("Error!");
      }
      res.json(result);
    })
  });
});
