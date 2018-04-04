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
    createMap: function (lat, lng, zoom, mapDivId, mapboxKey, mapboxStyle, styles) {
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
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.ROADMAP,
					s11.util.MapTypeId.DIEM,
                    s11.util.MapTypeId.OSM,
//                    s11.util.MapTypeId.HIKEBIKE,
                    s11.util.MapTypeId.LANDSCAPE,
                    s11.util.MapTypeId.MAPBOX,
//                    s11.util.MapTypeId.MAPBOX_SATELLITE,
//                    s11.util.MapTypeId.MAPBOX_STREETS,
//                    s11.util.MapTypeId.MAPBOX_OUTDOORS,
//                    s11.util.MapTypeId.MAPBOX_CUST,
//                    s11.util.MapTypeId.PIONEER,
//                    s11.util.MapTypeId.OTM,
//                    s11.util.MapTypeId.OUTDOORS,
                    s11.util.MapTypeId.MAPBOX_CUST_OUT




                ]

            },
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            mapTypeControl: true,
            scaleControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            styles: styles,
            disableDoubleClickZoom: true
        };

        var map = new google.maps.Map(document.getElementById(mapDivId), mapProp);




        var mapboxMap = createMapTypeOptions("Mapbox-Cust-Out", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/dschuld/" + mapboxStyle + "/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_CUST_OUT);


        //TODO include attribution div on map, see http://www.thunderforest.com/terms/
        var osmOptions = createMapTypeOptions("OSM", function (coord, zoom) {
            return "http://otile1.mqcdn.com/tiles/1.0.0/osm/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        });
        registerMapType(map, osmOptions, s11.util.MapTypeId.OSM);
//
//
//        var hikeBikeOptions = createMapTypeOptions("Hike & Bike", function (coord, zoom) {
//            return "http://a.tiles.wmflabs.org/hikebike/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, hikeBikeOptions, s11.util.MapTypeId.HIKEBIKE);
//
//
        var landscapeOptions = createMapTypeOptions("Landscape", function (coord, zoom) {
            return "https://a.tile.thunderforest.com/landscape/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        });
        registerMapType(map, landscapeOptions, s11.util.MapTypeId.LANDSCAPE);
//
//        var pioneerMap = createMapTypeOptions("Pioneer", function (coord, zoom) {
//            return "https://a.tile.thunderforest.com/pioneer/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, pioneerMap, s11.util.MapTypeId.PIONEER);
//
//
        var mapboxMap = createMapTypeOptions("Mapbox", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX);

//
//        var mapboxMap = createMapTypeOptions("Mapbox-Sat", function (coord, zoom) {
//            return "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
//        });
//        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_SATELLITE);
//
//
//        var mapboxMap = createMapTypeOptions("Mapbox-Streets", function (coord, zoom) {
//            return "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
//        });
//        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_STREETS);
//
//        var mapboxMap = createMapTypeOptions("Mapbox-Outdoors", function (coord, zoom) {
//            return "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
//        });
//        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_OUTDOORS);
//
//        var mapboxMap = createMapTypeOptions("Mapbox-Cust", function (coord, zoom) {
//            return "https://api.mapbox.com/styles/v1/dschuld/cip80f3cr0023cunsqdt0leuz/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
//        });
//        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_CUST);
//
//
//
//
//        var openTopoMap = createMapTypeOptions("OpenTopoMap", function (coord, zoom) {
//            return "https://a.tile.opentopomap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, openTopoMap, s11.util.MapTypeId.OTM);
//
//
//        var outdoorsMap = createMapTypeOptions("Outdoors", function (coord, zoom) {
//            return "https://a.tile.thunderforest.com/outdoors/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, outdoorsMap, s11.util.MapTypeId.OUTDOORS);

        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
		
		map.addListener('maptypeid_changed', function() {
			toggleImageOverlay(map.getMapTypeId() === google.maps.MapTypeId.ROADMAP);
		});
	

        return map;
    }
};

var imageBounds = {
    north: 50.279077314177246,
    south: 50.120336665230634,
    east: -125.00943042402092,
    west: -125.16394090269381
};
discoveryOverlay = new google.maps.GroundOverlay('./discovery_overlay.png',imageBounds);
	
var toggleImageOverlay = function(flag) {
	
	discoveryOverlay.setMap(flag? map : null);
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


