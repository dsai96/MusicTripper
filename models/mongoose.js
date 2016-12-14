var mongodb = require('mongodb');

var uri = 'mongodb://said:said@host:33368/playlists';

mongodb.connect(uri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {

  // Create song schema
  var playlistSchema = mongoose.Schema({
    name: String,
    artist: Array,
    duration: Number
  });

  // Store song documents in a collection called "songs"
  var Playlist = mongoose.model('allplaylists', playlistSchema);
  // var Playlists = mongoose.model('songs', allplaylists);


  // Create seed data
  var p1 = new Playlist({
    name: 'P1',
    artist: ["Rihanna", "Kanye West"],
    duration: 102312
  });

  var p2 = new Playlist({
    name: 'P2',
    artist: ["Coldplay"],
    duration: 12320
  });

  p1.save();
  p2.save();

  // Playlist.update({ song: 'One Sweet Day'}, { $set: { artist: 'Mariah Carey ft. Boyz II Men'} },
  //   function (err, numberAffected, raw) {
  //
  //     if (err) return handleError(err);
  //
  //     /*
  //      * Finally we run a query which returns all the hits that spend 10 or
  //      * more weeks at number 1.
  //      */
  //     Playlist.find({ duration: { $gte: 10} }).sort({ name: 1}).exec(function (err, docs){
  //
  //       if(err) throw err;
  //
  //       docs.forEach(function (doc) {
  //         console.log(
  //           'In the ' + doc['name'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
  //           ' topped the charts for ' + doc['duration'] + ' straight weeks.'
  //         );
  //       });
  //
  //       // Since this is an example, we'll clean up after ourselves.
        mongoose.connection.db.collection('allplaylists').drop(function (err) {
          if(err) throw err;

          // Only close the connection when your app is terminating
          mongoose.connection.db.close(function (err) {
            if(err) throw err;
          });
        });
      });
  //   }
  )
});


// var mongoose = require('mongoose');
//
// module.exports.init = function(app) {
//
//   var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
//                   replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
//   var mongodbUri = 'mongodb://said:said@host:33368/playlists';
//
//   mongoose.connect(mongodbUri, options);
//   var conn = mongoose.connection;
//
//   conn.on('error', console.error.bind(console, 'connection error:'));
//
//   conn.once('open', function() {
//     console.log('DB Connection open!');
//   });
// };
