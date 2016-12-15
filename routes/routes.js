var spotify = require('../controller/spotify.js');
var express = require('express');
var mongodb = require('mongodb');
var cors = require('cors');
const querystring = require('querystring');
var request = require('request');
var localStorage = require('../models/searchresults.js');


exports.init = function(app) {

  app.use(cors());

  app.post("/playlists/create", function(req, res) {
    if (req.body.playlistName && req.body.artists && req.body.durationValue && req.body.durationText) {
      localStorage.add(req.body.playlistName, req.body.artists, req.body.durationText, req.body.durationValue);
    }
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://said:said@ds133368.mlab.com:33368/playlists';
    // Connect to the server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
        res.send("Unable to connect to Mongo")
      } else {
        console.log('Connection established to', url);

        dataToInsert = [req.body.playlistName, req.body.artists, req.body.durationText, req.body.durationValue];
        db.collection('playlists').insert(req.body, function(err, result) {
          console.log("inserted!");
        })
      }
    })
    spotify.authorization(req, res);
  });


  app.get('/login', spotify.authorization);

  app.get('/callback', spotify.authentication);

  app.get('/playlists', function(req, res) {

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://said:said@ds133368.mlab.com:33368/playlists';
    // Connect to the server
    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
      res.send("Unable to connect to Mongo")
    } else {
      console.log('Connection established to', url);
      var collection = db.collection('playlists');
      collection.find({}).toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('playlists', {
            "allplaylists" : result
          });
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    }
    });

  });
}
