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
 * @fileoverview This file implements common helper functions.
 * @author davidschuld@gmail.com (David Schuld)
 */


var s11 = s11 || {};
s11.util = s11.util || {};


var factory = s11.geomodel.getFactory();

s11.util.geocodeLatLng = function (latlng, callback) {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                callback(results);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
};

s11.util.loadGeoJSON = function (json, style) {
    var features = new GeoJSON(json, style);
    return features;
};




s11.util.encodePathFromGeoJson = function (json, style) {
    var path = loadGeoJSON(json, style);
};

s11.util.encodePathFromGeoJsonString = function (jsonString, style) {
    var path = parseGeoJson(jsonString, style);
    return s11.util.encodePath(path[0].getPath());
};

s11.util.encodePath = function (path) {
    return google.maps.geometry.encoding.encodePath(path);
};

s11.util.parseGeoJson = function (jsonString) {
    var json = $.parseJSON(jsonString);
    return s11.util.loadGeoJSON(json, {
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#AAAAAA",
        fillOpacity: 0.5
    });
};

s11.util.fromLatLngToPoint = function (latLng, map) {
    var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
    var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
};

s11.util.MapTypeId = {};
s11.util.MapTypeId.OSM = "osm";
s11.util.MapTypeId.HIKEBIKE = "hikebike";
s11.util.MapTypeId.LANDSCAPE = "thunderforst-landscape";
s11.util.MapTypeId.OUTDOORS = "thunderforst-outdoors";
s11.util.MapTypeId.OTM = "opentopomap";
s11.util.MapTypeId.PIONEER = "thunderforst-pioneer";
s11.util.MapTypeId.MAPBOX = "mapbox-terrain";
s11.util.MapTypeId.MAPBOX_SATELLITE = "mapbox-satellite";
s11.util.MapTypeId.MAPBOX_STREETS = "mapbox-streets";
s11.util.MapTypeId.MAPBOX_CUST = "mapbox-cust";
s11.util.MapTypeId.MAPBOX_OUTDOORS = "mapbox-outdoors";
s11.util.MapTypeId.MAPBOX_CUST_OUT = "mapbox-cust-out";
s11.util.MapTypeId.MAPBOX_STREETS_READ_OVERLAY = "mapbox-streets-read-overlay";
s11.util.MapTypeId.MAPBOX_STREETS_QUADRA_OVERLAY = "mapbox-streets-quadra-overlay";
s11.util.MapTypeId.MAPBOX_STREETS_CORTES_OVERLAY = "mapbox-streets-cortes-overlay";




