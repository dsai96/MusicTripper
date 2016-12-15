var SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');
var localStorage = require('../models/searchresults.js');

module.exports.authorization = function (req, res) {
  console.log("authorization");
  var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));}
    return text;
  };
  var scopes = ['playlist-modify-public', 'playlist-modify-private'],
      redirect_uri = "http://localhost:8888/callback",
      clientId = '1731b6ace897418a8f6eba00b6ab7ad1',
      state = generateRandomString(16);
      var authURL = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          show_dialog: true,
          response_type: 'code',
          client_id: clientId,
          scope: scopes,
          redirect_uri: redirect_uri,
          state: state
        });
    res.redirect(authURL);
}

  addSongsToPlaylist = function(userID, spotifyApi, listOfArtists, duration, playlistId) {
    console.log("NEW CALL TO ADD SONGSs")
    artistIds = []
    for (i = 0; i < listOfArtists.length; i++) {
        spotifyApi.searchArtists(listOfArtists[i]).then(function(data2) {
            artistIds.push(data2.body.artists.items[0].id);
            setTimeout(spotifyApi.getArtistTopTracks(data2.body.artists.items[0].id, 'US')
              .then(function(data3) {
                URISforArtists = [];
                for (var j = 0; j < data3.body.tracks.length; j++) {
                  if (duration > 0) {
                    URISforArtists.push(data3.body.tracks[j].uri);
                    duration -= data3.body.tracks[j].duration_ms/1000;
                  }}
                  spotifyApi.addTracksToPlaylist(userID, playlistId, URISforArtists)
                  .then(function(trackData) {
                    // res.redirect("/playlists");
                    console.log('Added tracks to playlist!');
                    if (i == listOfArtists.length) {
                      relatedArtistNames = []
                      if (duration > 0) {
                        for (x = 0; x < artistIds.length; x++) {
                          spotifyApi.getArtistRelatedArtists(artistIds[x])
                          .then(function(artistData) {
                            for (var q = 0; q < artistData.body.artists.length; q++){
                              relatedArtistNames.push(artistData.body.artists[q].name);
                              if (q == artistData.body.artists.length - 1 ){
                                console.log("****************************************");
                                console.log(relatedArtistNames);
                                setTimeout(addSongsToPlaylist(userID, spotifyApi, relatedArtistNames, duration, playlistId), 1000);
                              }
                            }

                          })
                        }
                      } else {
                        return null;
                      }
                    }
                  }, function(err) {
                    console.log('Something went wrong!', err);
                  });
                }), 1000*i);
                }, function(err) {
                console.log('Something went wrong!', err);
              });
          }
    };


module.exports.authentication = function(req, res) {
    var credentials = {
    clientId : '1731b6ace897418a8f6eba00b6ab7ad1',
    clientSecret : '85bfc69acd274d86aaa4227fd181def7',
    redirectUri : 'http://localhost:8888/callback'
    };
    var spotifyApi = new SpotifyWebApi(credentials);
    var code = req.query.code || null;
    spotifyApi.authorizationCodeGrant(code).then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    spotifyApi.getMe().then(function(data2) {
      var newestSearchPlaylist = localStorage.getMostRecentPlaylist();
        var playlistName = newestSearchPlaylist.name;
        var artists = newestSearchPlaylist.artists;
        var duration = parseInt(newestSearchPlaylist.durationValue);
        if (typeof artists === "string") {
          artists = [artists];
        }
        var userID = data2.body.id;
        spotifyApi.createPlaylist(userID, playlistName, { 'public' : true }).then(function(data) {
                console.log('Created playlist!');
                setTimeout(addSongsToPlaylist(userID, spotifyApi, artists, duration, data.body.id), 1000);
              }, function(err) {
                console.log('Something went wrong in Creating playlist!', err);
              });
              res.redirect("/playlists");

    }, function(err) {
      console.log('Something went wrong in Authorization!', err);
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}
