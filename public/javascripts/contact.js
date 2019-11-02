jQuery(function ($) {
  // Asynchronously Load the map API 
  var script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDunXykyoL8RJ97753IG7xoE305iQzXkoU&callback=initialize";
  document.body.appendChild(script);
});

function initialize() {
  var map;
  var geocoder = new google.maps.Geocoder();
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    mapTypeId: 'roadmap'
  };

  // Display a map on the page
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  map.setTilt(45);

  // Multiple Markers
  let markers = []
  let address = ''

  for (let i = 0; i < $('.card-title').length; i++) {
    let place = ''
    place = $('#a' + (i + 1)).text()
    address = $('#b' + (i + 1)).text()
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == 'OK') {
        let item = [place, results[0].geometry.location.lat(), results[0].geometry.location.lng()]
        markers.push(item)
        place = ''

        // Display multiple markers on a map
        // Loop through our array of markers & place each one on the map  
        for (let i = 0; i < markers.length; i++) {
          var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
          bounds.extend(position);
          marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
          });

          // Automatically center the map fitting all markers on the screen
          map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
          this.setZoom(12);
          google.maps.event.removeListener(boundsListener);
        });
      } else {
        console.log(status);
      }
    })
  }
}