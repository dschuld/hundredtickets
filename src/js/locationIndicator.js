/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements a functionality to access an external service that provides information about 
 * the last known location, which is then shown on the map with a pegman icon.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};

var locationIndicator_PLUGIN_ID = "locationIndicator";

var addCurrentLocation = function (appData) {

    var locationIconPath = "http://www.penceland.com/images/google_map_man.gif";
    var locationServiceUrl = "https://big-vertex-117210.appspot.com/location/current";

    $.get(locationServiceUrl, function (locationData, status) {
        if (status === 'success') {
            callback(locationData, appData, locationIconPath);

            s11.pluginLoader.onLoad(locationIndicator_PLUGIN_ID, true);
        }
    });
};


var callback = function (locationData, appData, locationIconPath) {

    var location = appData.factory.createLatLng(locationData.coordinates[0], locationData.coordinates[1]);
    var locationText = locationData.timestamp.split(' ')[0];
    var myLocation = s11.geomodel.Place.createFromData(locationText, locationIconPath, location);
    var map = appData.map;
    appData.trip.addPlaces(myLocation);
    centerMap(locationData.coordinates[0], locationData.coordinates[1]);

    var latlng = {lat: location.lat(), lng: location.lng()};
    addGeocodeInfo(latlng, myLocation);
    appData.controls.add("https://drive.google.com/uc?export=download&id=0B48vYXs63P2ld3RrcmtlM1pWYVU", "Find me", function () {

        bounds = appData.factory.createLatLngBounds();
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() + 0.2, myLocation.getPosition().lng() + 0.2));
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() + 0.2, myLocation.getPosition().lng() - 0.2));
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() - 0.2, myLocation.getPosition().lng() + 0.2));
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() - 0.2, myLocation.getPosition().lng() - 0.2));


        appData.map.fitBounds(bounds);

    });

    appData.factory.addEventListener(map, 'zoom_changed', function () {
        myLocation.setMap(map.getZoom() >= 8 ? map : null);
    });

};

function addGeocodeInfo(latlng, locationMarker) {

    s11.util.geocodeLatLng(latlng, function (results) {
        locationMarker.getMarker().name = results[1].formatted_address + "<br>" + locationMarker.getMarker().name;
    });
}


s11.pluginLoader.addPlugin(locationIndicator_PLUGIN_ID, function (data) {
    addCurrentLocation(data);
});


