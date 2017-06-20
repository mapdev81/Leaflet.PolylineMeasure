var Markers = {

    drawMarkers: function(callback) {

    	var request = $.ajax({
            url: "./leaflet/Json/",
            method: "GET",
            contentType: "application/json",
            dataType: "json"
        });        

        request.fail(function(jqXHR, textStatus) {
        	var geoPositions = [];
            callback(geoPositions);
        });
    },

   
    getLatLang: function(LatLangs, callback) {
        console.log("LatLangs",LatLangs);
        var Positions = [];
        $.each(LatLangs[0], function(index, place) {
            var jsonObj = {
                "lat": place.lat,
                "lng": place.lng
            };
            Positions.push(jsonObj);
        });
        callback(Positions);
    },  

};