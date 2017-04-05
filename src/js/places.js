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
    queryPlaces(data);


};

var checkIfVisible = function (data, place, zoomJson) {
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
    data.factory.addEventListener(data.map, 'zoom_changed', function () {
        checkIfVisible(data, place, zoomJson);
    });

    checkIfVisible(data, place, zoomJson);

};

var addPlace = function (item, data, defaultIcon) {
    if (!item.location) {
        return;
    }
    var json = JSON.parse(item.location.S);
    var geoJson = s11.util.loadGeoJSON(json, {
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#AAAAAA",
        fillOpacity: 0.5
    });

    var icon = item.icon ? item.icon.S : defaultIcon;
    var place = s11.geomodel.Place.createFromData(item.name.S, icon, geoJson.position);
    place.setMap(data.map);

    if (item.zoom) {
        configureVisibility(item.zoom.S, place, data);
    }

    place.setInfoWindowContentProvider(s11.ui.getContentProvider(item.content.S, item.name.S, data.wpApi));
    data.factory.addEventListener(place.getMarker(), 'click', s11.ui.InfoWindow.show);
    data.trip.addPlaces(place);
}

function queryPlaces(data) {

        //Need to disable checksum validation, apparently above a certain threshold
        //DynamoDB does some compression stuff which causes the check to fail
        //--> queries with max 13 items returned worked, above this it failed.
        // see https://github.com/aws/aws-sdk-js/issues/405
        var dynamodb = new AWS.DynamoDB({dynamoDbCrc32: false});

        var queryParams = {
            ExpressionAttributeValues: {
                ":v1": {
                    N: "2"
                }
            },
            KeyConditionExpression: "visible = :v1",
            IndexName: 'visible-index',
            TableName: data.tripOptions.placeTableName
        };

        dynamodb.query(queryParams, function (err, result) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                var defaultIcon = result.Items.filter(function (item) {
                    var is = !item.location;
                    return is;
                })[0].icon.S;
                result.Items.forEach(function (item) {
                    addPlace(item, data, defaultIcon);

                });
            }
        });

        s11.pluginLoader.onLoad(places_PLUGIN_ID, true);    


}

s11.pluginLoader.addPlugin(places_PLUGIN_ID, function (data) {
    addPlaces(data);
});
