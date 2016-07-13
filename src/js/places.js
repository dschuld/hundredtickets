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
 * @fileoverview This file implements the functionality for loading and displaying places from an 
 * external data source.
 * @author davidschuld@gmail.com (David Schuld)
 */


var s11 = s11 || {};
s11.data = s11.data || {};
s11.ui = s11.ui || {};


var places_PLUGIN_ID = "places";

var addPlaces = function (data) {
    var tripOptions = data.tripOptions;
    var dataProvider = new s11.data.DataProvider(tripOptions.fusionTableApiKey, tripOptions.routeDataTableId,
            tripOptions.regionDataTableId, tripOptions.placeDataTableId);
    dataProvider.selectVisiblePlaces(placesDataHandler(data));
};

var checkIfVisible = function(data, place, zoomJson) {
    if (data.map.getZoom() <= zoomJson.max && map.getZoom() >= zoomJson.min) {
            place.getMarker().setMap(data.map);
        } else {
            place.getMarker().setMap(null);
        }
};



var configureVisibility = function (zoom, place, data) {

    var zoomJson = JSON.parse(zoom);
    zoomJson.max = zoomJson.max ? zoomJson.max : 100;
    zoomJson.min = zoomJson.min ? zoomJson.min : -1;
    data.factory.addEventListener(data.map, 'zoom_changed', function() {
        checkIfVisible(data, place, zoomJson);
    });
    
    checkIfVisible(data, place, zoomJson);

};

function placesDataHandler(data) {

    return function (placesData) {
        var defaultIcon = placesData.rows.filter(function (row) {
            var is = !row[3];
            return is;
        })[0][2];
        placesData.rows.forEach(function (row) {
            if (row[3]) {
                var name = row[0];
                var content = row[1];
                var icon = row[2] ? row[2] : defaultIcon;
                var location = row[3];
                var zoom = row[4];


                var json = JSON.parse(location);
                var geoJson = s11.util.loadGeoJSON(json, {
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "#AAAAAA",
                    fillOpacity: 0.5
                });



                var place = s11.geomodel.Place.createFromData(name, icon, geoJson.position);
                place.setMap(data.map);

                if (zoom) {
                    configureVisibility(zoom, place, data);
                }

                place.setInfoWindowContentProvider(s11.ui.getContentProvider(content, name, data.wpApi));
                data.factory.addEventListener(place.getMarker(), 'click', s11.ui.InfoWindow.show);
                data.trip.addPlaces(place);

            }

        });

        s11.pluginLoader.onLoad(places_PLUGIN_ID, true);
    };


}

s11.pluginLoader.addPlugin(places_PLUGIN_ID, function (data) {
    addPlaces(data);
});
