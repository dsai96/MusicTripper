var spotify = require('/Users/dsai96/Desktop/Mobile to Cloud/finalProj/controller/spotify.js');
var cors = require('/Users/dsai96/Desktop/Mobile to Cloud/finalProj/js/cors.js');
var express = require('express');
var mongodb = require('mongodb');
const querystring = require('querystring');
var request = require('request');

exports.init = function(app) {

  app.post("/playlists/create", spotify.playlistCreation);

  app.get('/login', spotify.authorization);

  app.get('/callback', spotify.authentication);

  // app.get('/playlists', function(req, res) {
  //
  //   var MongoClient = mongodb.MongoClient;
  //   var url = 'mongodb://said:said@host:33368/playlists';
  //
  //   // Connect to the server
  //   MongoClient.connect(url, function (err, db) {
  //   if (err) {
  //     console.log('Unable to connect to the Server', err);
  //     res.send("Unable to connect to Mongo")
  //   } else {
  //     console.log('Connection established to', url);
  //     var collection = db.collection('playlists');
  //
  //     collection.find({}).toArray(function (err, result) {
  //       if (err) {
  //         res.send(err);
  //       } else if (result.length) {
  //         res.render('playlists', {
  //           "allplaylists" : result
  //         });
  //       } else {
  //         res.send('No documents found');
  //       }
  //       //Close connection
  //       db.close();
  //     });
  //   }
  //   });
  //
  // });
}
