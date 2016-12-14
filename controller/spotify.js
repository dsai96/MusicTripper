module.exports.authentication = function (req, res) {
  var passport = require('passport');
  var SpotifyStrategy = require('/Users/dsai96/Desktop/Mobile to Cloud/finalProj/node_modules/passport-spotify/lib/passport-spotify/index.js').Strategy;
  client_id = '1731b6ace897418a8f6eba00b6ab7ad1'; // Your client id
  client_secret = '85bfc69acd274d86aaa4227fd181def7'; // Your secret
  redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
  var SpotifyWebApi = require('spotify-web-api-node');
  console.log("A");
  var spotifyApi = new SpotifyWebApi({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8888/auth/spotify/callback"
  });
  passport.authenticate( 'spotify',
    {scope: ['playlist-modify-public', 'playlist-modify-private'], showDialog: true}
  )

  module.exports.spotifyCalculations = function(accessToken, refreshToken, profile, done) {
        console.log("c");
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.createPlaylist(profile.id, req.body.playlistName, { 'public' : true })
      .then(function(data) {
        console.log('Created playlist!');
        var allURIS = [];
        var completedEvents = req.body.artists;
        for (i = 0; i < req.body.artists; i++) {
            var artistSearch = 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(artistNames[i]) + '&type=artist';
            $.getJSON(artistSearch, function(data){
                if (data != 'undefined') {
                  var id = data.artists.items[0].id;
                  var artistTopSongsSearch = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=US';
                  console.log(artistTopSongsSearch);
                  $.getJSON(artistTopSongsSearch, function(data2) {
                    for (j = 0; j < 10 ; j++) {
                      allURIS.push(data2.tracks[j].uri);
                    }
                    completedEvents--;
                    if (completedEvents == 0) {
                      console.log(allURIS);
                      spotifyApi.addTracksToPlaylist(profile.id, data.body.id, allURIS).then(function(data) {
                        console.log('Added tracks to playlist!');
                      }, function(err) {
                        console.log('Something went wrong in Adding tracks!', err);
                      });
                    }
                  })
                }
                else {
                  console.log("NOT FOUND ARTIST NAME");
                }
              });
        }
      }, function(err) {
        console.log('Something went wrong in Creating playlist!', err);
      });
    };

};
