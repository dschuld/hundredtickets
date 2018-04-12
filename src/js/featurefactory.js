/* 
 * Copyright 2015 schuldd.
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
 * @fileoverview This file defines the FeatureFactory component, which encapsulates the functionalities that are
 * specific to a certain mapping API. Currently only Google Maps API is supported.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
s11.geomodel = s11.geomodel || {};


//+++++++++++++++++++++++++++++++
//Google Maps specifics
//+++++++++++++++++++++++++++++++


//A factory object that encapsulates the functionality specific to a certain mapping API, in this case Google Maps.
var factory = {
    addEventListener: function (component, eventName, action) {
        google.maps.event.addListener(component, eventName, action);
    },
    clearListeners: function (component, eventName) {
        google.maps.event.clearListeners(component, eventName);
    },
    addDomListener: function (component, eventName, action) {
        google.maps.event.addDomListener(component, eventName, action);
    },
    getInfoWindow: function (forceNew) {
        return createInfoWindow(forceNew);
    },
    //TODO merge to getInfoWindow when all references have been solved
    createInfoWindow: function (forceNew) {
        if (!this.infoWindow || forceNew) {
            this.infoWindow = new google.maps.InfoWindow();
            return this.infoWindow;
        }
        return this.infoWindow;
    },
    createMarker: function (markerOpts) {
        return new google.maps.Marker(markerOpts);
    },
    createPolyline: function (polylineOpts) {
        return new google.maps.Polyline(polylineOpts);
    },
    createPolygon: function (polygonOpts) {
        return new google.maps.Polygon(polygonOpts);
    },
    createLatLng: function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },
    createLatLngBounds: function () {
        return  new google.maps.LatLngBounds();
    },
    createMVCObject: function () {
        return new google.maps.MVCObject();
    },
    computeLength: function (path) {
        return google.maps.geometry.spherical.computeLength(path);
    },
    decodePath: function (encodedPath) {
        return google.maps.geometry.encoding.decodePath(encodedPath);
    },
    encodePath: function (path) {
        return google.maps.geometry.encoding.encodePath(path);
    },
    createMap: function (lat, lng, zoom, mapDivId) {
        if (!zoom) {
            zoom = 3;
        }      

        var mapProp = {
            center: new google.maps.LatLng(lat, lng),
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            rotateControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.LEFT_CENTER,
                mapTypeIds: [
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.TERRAIN,
					s11.util.MapTypeId.MAPBOX_STREETS_READ_OVERLAY,
					s11.util.MapTypeId.MAPBOX_STREETS_QUADRA_OVERLAY,
					s11.util.MapTypeId.MAPBOX_STREETS_CORTES_OVERLAY
                ]

            },
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            mapTypeControl: true,
            scaleControl: true,
            disableDoubleClickZoom: true
        };

        var map = new google.maps.Map(document.getElementById(mapDivId), mapProp);
       
		
        var readMap = createMapTypeOptions("Read Island", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
        });
        registerMapType(map, readMap, s11.util.MapTypeId.MAPBOX_STREETS_READ_OVERLAY);
		
        var quadraMap = createMapTypeOptions("Quadra Island", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
        });
        registerMapType(map, quadraMap, s11.util.MapTypeId.MAPBOX_STREETS_QUADRA_OVERLAY);
		
        var cortesMap = createMapTypeOptions("Cortes Island", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
        });
        registerMapType(map, cortesMap, s11.util.MapTypeId.MAPBOX_STREETS_CORTES_OVERLAY);

        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		
		map.addListener('maptypeid_changed', function() {
			toggleImageOverlay(map.getMapTypeId());
		});
	

        return map;
    }
};

var readBounds = {
		north: 50.279077314177246,
		south: 50.120336665230634,
		east: -125.00943042402092,
		west: -125.16394090269381
};

var cortesBounds = {
		north: 50.242541737828816,
		south: 50.00685825162496,
		east: -124.834453037515,
		west: -125.1157062633709
};
	
var quadraBounds = {
		north: 50.30790283839058,
		south: 49.99081741870277,
		east: -125.06904427114364,
		west: -125.43428980740612
};	
	
	
readOverlay = new google.maps.GroundOverlay('./read_overlay.png',readBounds);
quadraOverlay = new google.maps.GroundOverlay('./quadra_overlay.png',quadraBounds);
cortesOverlay = new google.maps.GroundOverlay('./cortes_overlay.png',cortesBounds);
	
var toggleImageOverlay = function(flag) {
	
	readOverlay.setMap(flag === s11.util.MapTypeId.MAPBOX_STREETS_READ_OVERLAY? map : null);
	quadraOverlay.setMap(flag === s11.util.MapTypeId.MAPBOX_STREETS_QUADRA_OVERLAY? map : null);
	cortesOverlay.setMap(flag === s11.util.MapTypeId.MAPBOX_STREETS_CORTES_OVERLAY? map : null);
}

var registerMapType = function (map, options, mapTypeId) {

    var mapTypeOsm = new google.maps.ImageMapType(options);
    map.mapTypes.set(mapTypeId, mapTypeOsm);
};

var createMapTypeOptions = function (mapTypeName, makeUrl) {

    return {
        getTileUrl: function (coord, zoom) {
            return makeUrl(coord, zoom);
        },
        tileSize: new google.maps.Size(256, 256),
        name: mapTypeName,
        maxZoom: 18
    };

};

s11.geomodel.getFactory = function () {
    return factory;
};


