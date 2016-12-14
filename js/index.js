
$(document).ready(function() {

  function getDistance(event) {
    var start = $('#start').val();
    var end = $('#end').val();
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [start],
      destinations: [end],
      travelMode: 'DRIVING',
    }, function(response, status) {
      // console.log(response);
      if (response == 'undefined') {
        // $("#responseArea").html(distance);
        // var distance = "Please enter valid addresses";
      } else {
        distance = response.rows[0].elements[0].duration.text;
        console.log(distance);
        return distance;
        // $("#responseArea").html(distance);
      }
    });
    // event.preventDefault();
  };

  function getArtistNames() {
    var artistNames = [];
    for (i = 0; i < $(".artist").length; i++) {
      artistNames.push($(".artist")[i].value);
    }
    return artistNames;
  }

    $('#get').submit(function(event, inputArtists) {
     event.preventDefault();
     var artists = getArtistNames();
     var data = {"playlistName": $('#playlistName').val(), "artists": artists, "distance": getDistance()};
     $.ajax({
         url: '/playlists/create',
         data: data,
         type: 'POST',
         dataType: 'json',
         traditional: true,
         crossDomain: true,
         success: function(result) {
             console.log(result)
             console.log("Post Req completed!");
         }
     });
    });

    var maxBoxes = 10;
    var textboxCount = 1;

    $("#add_field_button").click(function(e){
      console.log("SUP");
      e.preventDefault();
      if(textboxCount < maxBoxes){
          textboxCount++;
          $(".input_fields_wrap").append('<div><input type="text" name="mytext[]" class = "artist"/><a href="#" class="remove_field"> Remove</a></div><br>');
      }
    });

    $(".input_fields_wrap").on("click",".remove_field", function(e){
      e.preventDefault();
      $(this).parent('div').remove();
      textboxCount--;
    });

});
