
$(document).ready(function() {

//calls the Google api to find the duration of trip in text and value
  function getDistance(event, callback) {
    var start = $('#start').val();
    var end = $('#end').val();
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [start],
      destinations: [end],
      travelMode: 'DRIVING',
    }, function(response, status) {
      if (response == 'undefined') {
      } else {
        distance = response.rows[0].elements[0].duration;
        callback(distance);
      }
    });
  };


  function getArtistNames() {
    var artistNames = [];
    for (i = 0; i < $(".artist").length; i++) {
      artistNames.push($(".artist")[i].value);
    }
    //required to return artistsNames as an array
    if ($(".artist").length == 0){
      artistNames = [$(".artist").value];
    }
    return artistNames;
  }

  //post request to send form data to the server and handle Spotify calls
    $('#get').submit(function(event, inputArtists) {
     event.preventDefault();
     getDistance(event, submitFormData)
    });

    function submitFormData(distance){
      var artists = getArtistNames();
      var data = {"playlistName": $('#playlistName').val(), "artists": artists, "durationText": distance.text, "durationValue": distance.value};
      $.ajax({
          url: '/playlists/create',
          data: data,
          type: 'POST',
          dataType: 'json',
          traditional: true,
          crossDomain: true,
          success: function(result) {
              window.location.href = "/login";
          }
      });
    }

    var maxBoxes = 10;
    var textboxCount = 1;

    $("#add_field_button").click(function(e){
      console.log("SUP");
      e.preventDefault();
      if(textboxCount < maxBoxes){
          textboxCount++;
          $(".input_fields_wrap").append('<div class="textbox"><input type="text" class = "artist"/><a href="#" class="remove_field"> Remove</a><br><br></div>');
      }
    });

    $(".input_fields_wrap").on("click",".remove_field", function(e){
      e.preventDefault();
      $(this).parent('div').remove();
      textboxCount--;
    });

});
