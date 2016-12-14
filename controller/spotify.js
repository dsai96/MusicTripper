var SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');

authorization = function (req, res) {
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
    console.log(authURL);
    res.redirect(authURL);
}

//Spotify work after authentication
module.exports.playlistCreation = function (req, res) {
  // authorization();

  spotifyApi.createPlaylist('dsiddharth', req.body.playlistName, { 'public' : true })
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
                        spotifyApi.addTracksToPlaylist("dsiddharth", data.body.id, allURIS).then(function(data) {
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


module.exports.authentication = function(req, res) {
    console.log("authentication");
    var credentials = {
    clientId : '1731b6ace897418a8f6eba00b6ab7ad1',
    clientSecret : '85bfc69acd274d86aaa4227fd181def7',
    redirectUri : 'http://localhost:8888/callback'
    };
    var spotifyApi = new SpotifyWebApi(credentials);
    var code = req.query.code || null;

    spotifyApi.authorizationCodeGrant(code).then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    spotifyApi.getMe().then(function(data2) {
      console.log(data2)

    }, function(err) {
      console.log('Something went wrong in Authorization!', err);
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}
