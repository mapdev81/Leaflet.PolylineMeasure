L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhdWhhbm1vaGl0IiwiYSI6IjE0YTljYTgyY2IzNDVlMmI0MTZhNzMwOGRkMzI4MGY3In0.vNQxFF8XYPTbbjm7fD72mg';

var mapLeaflet = L.mapbox.map('map', 'mapbox.streets', {
    attributionControl: false,
    zoomControl: false
});

mapLeaflet.setView([47.8, 13.0], 5);

var autoComplete = L.mapbox.geocoderControl('mapbox.places', {
    autocomplete: true,
    keepOpen: false
});

var zoomCtrl = L.control.zoom({
    position: 'bottomright'
}).addTo(mapLeaflet);

var customLayer = L.mapbox.featureLayer().addTo(mapLeaflet);
var markerfeatureGroup = L.featureGroup().addTo(mapLeaflet);

autoComplete.on("select", function(res) {
    autoComplete._toggle()
    Markers.drawMarkersByLocations(res.feature.center[1], res.feature.center[0], function(geoPositions) {
        clearLayers();
        customLayer.setGeoJSON(geoPositions);
        console.log(geoPositions);
        $.each(geoPositions, function(index, place) {
            var circle = L.circle([place.geometry.coordinates[1], place.geometry.coordinates[0]], place.icon.className*1000, {
                color: '#FEA900',
                fillColor: '#FED175',
                fillOpacity: 0.5,
                title:place.properties.title
            });
            markerfeatureGroup.addLayer(circle);
        });
    });
});
mapLeaflet.addControl(autoComplete);

mapLeaflet.scrollWheelZoom.enable();

var markerLayer = L.mapbox.featureLayer().addTo(mapLeaflet);

var featureGroup = L.featureGroup().addTo(mapLeaflet);

Markers.drawMarkers(function(geoPositions) {
    clearLayers();
    markerLayer.setGeoJSON(geoPositions);
    $.each(geoPositions, function(index, place) {
        var circle = L.circle([place.geometry.coordinates[1], place.geometry.coordinates[0]], place.icon.className * 1000, {
            color: '#FEA900',
            fillColor: '#FED175',
            fillOpacity: 0.5,
            title:place.properties.title
        });
        markerfeatureGroup.addLayer(circle);
    });
});


var circle_options = {
    color: '#fff',
    opacity: 1,
    weight: 10,
    fillColor: '#000',
    fillOpacity: 0.6
};

var polyline_options = {
    color: '#000'
};

var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polyline: {
            metric: true,
            shapeOptions: {
                color: '#4245f4'
            }
        },
        polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
                color: '#f48942',
                timeout: 1000
            },
            shapeOptions: {
                color: '#f48942'
            }
        },
        circle: {
            shapeOptions: {
                color: '#662d91'
            }
        },
        marker: false
    },
    edit: {
        featureGroup: featureGroup
    }
}).addTo(mapLeaflet);

mapLeaflet.on('draw:created', function(e) {

    featureGroup.clearLayers();
    featureGroup.addLayer(e.layer);
    mapLeaflet.fitBounds(e.layer.getBounds());
    var insidemarkers=[];
    var message="";

    $.each(markerfeatureGroup.getLayers(), function(i, marker) {
        if (e.layer.getBounds().overlaps(marker.getBounds())) {
            var m = {
                "title": marker.options.title,
                "lat": marker._latlng.lat,
                "lang": marker._latlng.lng,
                "radius": marker.getRadius()/1000
            };
            insidemarkers.push(m);
            if(message==""){
                message= marker.options.title;
            }else{
                message=message+", "+ marker.options.title;
            }
        }
    });

    if(message!=""){
        alert(message);
    }
    console.log(insidemarkers);
});

function clearLayers() {
    if (markerLayer instanceof L.mapbox.FeatureLayer) {
        markerLayer.clearLayers();
    } else {
        markerLayer = L.mapbox.featureLayer().addTo(mapLeaflet);
    }
    if (customLayer instanceof L.mapbox.FeatureLayer) {
        customLayer.clearLayers();
    } else {
        customLayer = L.mapbox.featureLayer().addTo(mapLeaflet);
    }
    featureGroup.clearLayers();
    markerfeatureGroup.clearLayers();
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}