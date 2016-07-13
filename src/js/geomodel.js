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
 * @fileoverview This file contains the s11.geomodel namespace. It defines the feature types as well as other,
 *  feature-related functions.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
s11.geomodel = s11.geomodel || {};

var factory = s11.geomodel.getFactory();


//================================
//TODO this should be extracted to plugin when possible

var boundsCache = {};

var focusser = factory.createMVCObject();
s11.geomodel.getFocusser = function () {
    return focusser;
};

factory.addEventListener(focusser, 'part_changed', function () {
    var focussedPart = focusser.get('part');
    log(focussedPart === null ? "Unfocus" : "Set focus on " + focussedPart.name);
});



var isWithin = function (innerPart, outerPart) {
    //TODO extend for multiple withins
    return innerPart.within === outerPart.name;
};


var checkCurrentFocus = function (region) {

    return function () {
        var focussedPart = focusser.get('part');
        if (focussedPart === null) {
            region.setVisible(true);
            return;
        }

        if ($.inArray(focussedPart, region.getParts()) >= 0) {
            region.setVisible(false);
        } else {
            region.setVisible(true);
            region.getParts().forEach(function (part) {
                if (isWithin(focussedPart, part)) {
                    region.setVisible(false);
                }
            });
        }

        focussedPart.setOptions({
            clickable: false
        });

    };
};


var zoomOnPart = function () {
    var bounds = getPolygonBounds(this);
    var map = this.parentRegion.getMap();
    var currentFocussedPart = focusser.get('part');
    if (currentFocussedPart) {
        currentFocussedPart.setVisible(true);
    }

    //fit bounds if polygon bounds are completely visible within map
    //this prevents unzooming when focussing in high zoom
    var mapBounds = map.getBounds();
    //if (containsBounds(mapBounds, bounds)) {
        map.fitBounds(bounds);
    //} 

    focusser.set('focusZoom', map.getZoom());
    focusser.set('part', this);
//    this.setVisible(false);
};

var containsBounds = function(outerBounds, innerBounds) {
    return outerBounds.contains(innerBounds.getNorthEast()) && outerBounds.contains(innerBounds.getSouthWest());
};

var getPolygonBounds = function (polygon) {

    var bounds = boundsCache[polygon.get('id')];
    if (!bounds) {
        bounds = factory.createLatLngBounds();
        polygon.getPath().forEach(function (element) {
            bounds.extend(element);
        });
        boundsCache[polygon.get('id')] = bounds;
    }

    return bounds;
};


//================================
//End focus mode stuff

/**
 * Abstract base class that represents a feature. All elemeents of the trip are derived from this class.<br>
 * @constructor 
 */
s11.geomodel.Feature = function () {

    /**
     * @type {google.maps.Map}
     */
    var map;

    /**
     * Returns the currently active map
     * @returns {google.maps.Map}
     */
    this.getMap = function () {
        return map;
    };

    /**
     * Sets the feature's map.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        map = newMap;
    };


};

/**
 * Class that represents a place of the trip, i.e. a location where a marker is shown.
 * 
 * @param {google.maps.Marker} placeMarker The marker that is wrapped by this place object. It is also possible to 
 * create a place from a location, use the Place.createFromData() method for that purpose.
 * @constructor 
 */
s11.geomodel.Place = function (placeMarker) {

    s11.geomodel.Feature.call(this);

    /**
     * @type {google.maps.Marker}
     */
    var marker;
    if (placeMarker) {
        marker = placeMarker;
    }



    factory.addEventListener(marker, 'mouseover', showPlaceTooltip);
    factory.addEventListener(marker, 'mouseout', s11.tooltip.hide);
    //factory.addEventListener(marker, 'click', newInfoWindow.show);
    //factory.addEventListener(marker, 'click', s11.util.showInfoWindow);

    //marker.infoWindowContentProvider = s11.util.BlogExcerptContentProvider.create(marker.name);

    /**
     * Returns the marker associated to this place.
     * @returns {google.maps.Marker}
     */
    this.getMarker = function () {
        return marker;
    };

    /**
     * Sets the marker associated with this place
     * @param {google.maps.Marker} newMarker
     */
    this.setMarker = function (newMarker) {
        marker = newMarker;
    };

    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * Sets the roue's map, and recursively sets the map to all legs.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);
        marker.setMap(newMap);

    };

};

s11.geomodel.MovingMarker = function (placeMarker) {

    s11.geomodel.Place.call(this, placeMarker);

};

/**
 * Abstract base class that represents a colored feature.
 * 
 * @param {string} newColor Color in 6 byte hex values
 * @constructor 
 */
s11.geomodel.ColoredFeature = function (newColor) {

    s11.geomodel.Feature.call(this);

    /**
     * @type {String}
     */
    var color = newColor;

    /**
     * @returns {String}
     */
    this.getColor = function () {
        return color;
    };

};

/**
 * Class that represents a region of a trip.<br>
 * A region consists of parts, which are basically extended Google Maps polygons. Parts can be added from various
 * sources. When a map is set to the region, the parts are printed on the map with the part boundaries having the color
 * specified at region creation. Parts are highlighted on mouse hover and show an info window with a title, description 
 * and optional image on a mouse click.<br>
 * 
 * @param {string} newColor Color in 6 byte hex values
 * @constructor 
 */
s11.geomodel.Region = function (newColor) {

    s11.geomodel.ColoredFeature.call(this, newColor);

    /**
     * @type {google.maps.Polyline[]}
     */
    var parts = [];

    var nextId = 0;


    factory.addEventListener(focusser, 'part_changed', checkCurrentFocus(this));

    this.nextId = function () {
        return nextId++;
    };

    /**
     * Returns the regions polygons
     * @returns {google.maps.Polygon[]}
     */
    this.getParts = function () {
        return parts;
    };

    /**
     * Sets the map of the region to null and removes all existing parts.
     */
    this.clear = function () {
        map = null;
        callOnAllParts(function (part) {
            part.setMap(null);
        });
        parts = [];
    };

    this.setVisible = function (flag) {
//        var zIndex = flag? part.zIndex
        callOnAllParts(function (part) {
            part.setOptions({
                clickable: flag,
                strokeColor: newColor
//                zIndex: 20
            });
        });

    };


    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * Sets the route's map, and recursively sets the map to all legs.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);

        callOnAllParts(function (part) {
            part.setMap(newMap);
        });

    };

    var callOnAllParts = function (func) {
        if (parts) {
            parts.forEach(func);
        }
    };

};



/**
 * Class that represents a route of a trip.<br>
 * A route consists of legs, which are basically extended Google Maps polylines. Legs can be added from various sources. 
 * When a map is set to the route, the legs are printed on the map in the color specified at route creation. Legs are 
 * highlighted on mouse hover and show an info window with a title, description and optional image on a mouse click.<br>
 * 
 * @param {string} newColor Color in 6 byte hex values
 * @constructor 
 */
s11.geomodel.Route = function (newColor) {

    s11.geomodel.ColoredFeature.call(this, newColor);


    /**
     * @type {google.maps.Polyline[]}
     */
    var legs = [];

    /**
     * Returns the route's legs
     * @returns {google.maps.Polyline[]}
     */
    this.getLegs = function () {
        return legs;
    };

    this.clear = function () {
        map = null;
        if (legs) {
            legs.forEach(function (leg) {
                leg.setMap(null);
            });
        }
        legs = [];
    };

    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * Sets the roue's map, and recursively sets the map to all legs.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);
        legs.forEach(function (leg) {
            leg.setMap(newMap);
        });
    };


};

/**
 * Class that represents a trip.
 * This is a container class that contains the trip's routes, regions and places.
 * It inherits the map field from Feature, which recursively sets the map to all features contained in the trip.
 * 
 * @constructor 
 */
s11.geomodel.Trip = function () {

    s11.geomodel.Feature.call(this);

    /**
     * @type {s11.geomodel.Route[]}
     */
    var _routes = [];

    /**
     * @type {s11.geomodel.Place[]}
     */
    var _places = [];

    /**
     * @type {s11.geomodel.Region[]}
     */
    var _regions = [];

    /**
     * Returns the trip's places
     * @returns {s11.geomodel.Place[]}
     */
    this.getPlaces = function () {
        return _places;
    };

    /**
     * Returns the trip's routes
     * @returns {s11.geomodel.Route[]}
     */
    this.getRoutes = function () {
        return _routes;
    };

    /**
     * Returns the trip's regions
     * @returns {s11.geomodel.Region[]}
     */
    this.getRegions = function () {
        return _regions;
    };


    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * 
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);
        setFeatureMap(_routes, newMap);
        setFeatureMap(_regions, newMap);
        setFeatureMap(_places, newMap);
    };

};


function inherits(subclass, superclass) {
    subclass.prototype = Object.create(superclass);
    subclass.prototype.constructor = subclass;
}


inherits(s11.geomodel.Trip, s11.geomodel.Feature);
inherits(s11.geomodel.Place, s11.geomodel.Feature);
inherits(s11.geomodel.MovingMarker, s11.geomodel.Place);
inherits(s11.geomodel.ColoredFeature, s11.geomodel.Feature);
inherits(s11.geomodel.Region, s11.geomodel.ColoredFeature);
inherits(s11.geomodel.Route, s11.geomodel.ColoredFeature);

//+++++++++++++++++++++++++++++++
//Public Trip methods
//+++++++++++++++++++++++++++++++

/**
 * Adds places to the trip. The method consumes a single place or an array of places.
 * @param {s11.geomodel.Place | s11.geomodel.Place[]} places A place or an array of places.
 */
s11.geomodel.Trip.prototype.addPlaces = function (places) {
    this.addFeatures(places, this.getPlaces());
};

/**
 * Adds routes to the trip. The method consumes a single route or an array of routes.
 * @param {s11.geomodel.Route | s11.geomodel.Route[]} routes places A route or an array of routes.
 */
s11.geomodel.Trip.prototype.addRoutes = function (routes) {
    this.addFeatures(routes, this.getRoutes());
};

/**
 * Adds regions to the trip. The method consumes a single region or an array of regions.
 * @param {s11.geomodel.Region | s11.geomodel.Region[]} regions places A region or an array of regions.
 */
s11.geomodel.Trip.prototype.addRegions = function (regions) {
    this.addFeatures(regions, this.getRegions());
};

/**
 * Generic method for adding features to the trip. The method consumes a single feature or an array of features.<br>
 * This method should not be called directly, since there are specific methods for each feature type. When called 
 * directly, it is important that the type of features and collection fit and that the correct collection is passed.
 * @param {s11.geomodel.Feature | s11.geomodel.Features[]} features A feature or an array of features.
 * @param {s11.geomodel.Feature[]} collection The feature collections, i.e. the trips routes, regions or places.
 */
s11.geomodel.Trip.prototype.addFeatures = function (features, collection) {
    if (features instanceof Array) {
        features.forEach(function (feature) {
            collection.push(feature);
        });
    } else {
        collection.push(features);
    }
};

//+++++++++++++++++++++++++++++++
//Public Place methods
//+++++++++++++++++++++++++++++++

/**
 * Returns the place's location. This is just a shortcut to getMarker().getLocation().
 * @return {google.maps.LatLng} position
 */
s11.geomodel.Place.prototype.getPosition = function () {
    return this.getMarker().getPosition();
};
/**
 * Returns the place's location. This is just a shortcut to getMarker().getLocation().
 * @return {google.maps.LatLng} position
 */
s11.geomodel.Place.prototype.setInfoWindowContentProvider = function (infoWindowContentProvider) {
    return this.getMarker().infoWindowContentProvider = infoWindowContentProvider;
};


/**
 * Creates a place from the given data.
 * 
 * @param {String} name Name of place. Appears as the info window title when the part is clicked on.
 * @param {String} text Appears as the info window content when the place is clicked on.
 * @param {String} link An optional link to a image that can be displayed in the info window when the place is clicked
 * @param {String} icon An optional icon to mark the place. If this is not provided, the default google maps icon is
 * used.
 * @param {google.maps.LatLng} position The position of the place.
 */
s11.geomodel.Place.createFromData = function (name, icon, position) {
    var markerOpts = {
        name: name,
        position: position
    };

    if (icon) {
        markerOpts.icon = icon;
    }
    var marker = factory.createMarker(markerOpts);
    var place = new s11.geomodel.Place(marker);
    return place;
};

//+++++++++++++++++++++++++++++++
//Public Region methods
//+++++++++++++++++++++++++++++++

//TODO construct from LatLng

s11.geomodel.Region.prototype.BORDER_STROKE_WEIGHT = 1.5;

s11.geomodel.Region.prototype.configureHighlighting = function () {

    this.getParts().forEach(function (part) {
        factory.clearListeners(part, 'mouseover');
        factory.clearListeners(part, 'mouseout');
        factory.addEventListener(part, 'mouseover', highlightRegion);
        factory.addEventListener(part, 'mouseout', unhighlightRegion);
    });
};


/**
 * Adds a part to the region. 
 * @param {google.maps.Polygon} part
 * @param partOptions Options Object: 
 * - name: Name of part. Appears as the info window title when the part is clicked on.
 * - text: Appears as the info window content when the part is clicked on.
 * - link: An optional link to a image that can be displayed in the info window when the part is clicked
 * - type: The type of the part (@see s11.data.type). This is translated to the zIndex of the feature,
 * meaning that a feature with a higher type value will be shown in the front.
 */
s11.geomodel.Region.prototype.addPart = function (part, partOptions) {
    part.setOptions({
        paths: part.getPaths(),
        strokeColor: this.getColor(),
        strokeOpacity: 0,
        strokeWeight: s11.geomodel.Region.prototype.BORDER_STROKE_WEIGHT,
        fillColor: part.fillColor,
        fillOpacity: 0.0,
        zIndex: partOptions.type
    });
    part.name = partOptions.name;
    part.text = partOptions.text;
    part.link = partOptions.link;
    part.color = this.getColor();
    part.parentRegion = this;
    part.within = partOptions.within;


//    factory.addEventListener(part, 'click', zoomOnPart);
    factory.addEventListener(part, 'dblclick', zoomOnPart);

    part.set('id', partOptions.name + '_' + this.nextId());
    part.setMap(this.getMap());
    this.getParts().push(part);

    this.configureHighlighting();

    return part;

};

/**
 * Adds a part to the region. 
 * @param partOptions Options Object: 
 * - geoJson: An array that contains the leg as GeoJSON Polygon objects.
 * - name: Name of part. Appears as the info window title when the part is clicked on.
 * - text: Appears as the info window content when the part is clicked on.
 * - link: An optional link to a image that can be displayed in the info window when the part is clicked
 * - type: The type of the part (@see s11.data.type). This is translated to the zIndex of the feature,
 * meaning that a feature with a higher type value will be shown in the front.
 */
s11.geomodel.Region.prototype.addParts = function (partOptions) {

    var jsonPolygons = partOptions.geoJson;
    if (jsonPolygons instanceof Array) {
        var returnParts = [];
        jsonPolygons.forEach(function (feature) {
            returnParts.push(this.addPart(feature, partOptions));
        }, this);
        return returnParts;
    } else {
        return this.addPart(jsonPolygons, partOptions);
    }
};

s11.geomodel.MovingMarker.prototype.moveAlongRoute = function (route) {

    var movingMarker = this;
    var pathArray = [];
    route.getLegs().forEach(function (leg) {
        pathArray.push(leg.getPath().getArray());
    });
    var path = pathFolder.foldPath(pathArray);
    var array = path;
    var length = array.length;
    var i = 0;

    window.setInterval(function () {
        if (i < length) {
            movingMarker.getMarker().setPosition(array[i]);
            i += 10;
        }
    }, 10);


};


//+++++++++++++++++++++++++++++++
//Public Route methods
//+++++++++++++++++++++++++++++++

/**
 * Adds a leg to the route. 
 * @param {google.maps.Polyline} leg
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 */
s11.geomodel.Route.prototype.addLeg = function (leg, legName) {

    leg.name = legName;
    factory.addEventListener(leg, 'mouseover', highlightPath);

    factory.addEventListener(leg, 'mouseover', showRouteTooltip);
    factory.addEventListener(leg, 'mouseout', s11.tooltip.hide);
    factory.addEventListener(leg, 'mouseout', unhighlightPath);

    leg.setMap(this.getMap());
    this.getLegs().push(leg);

};

/**
 * Adds a leg to the route. 
 * @param {MVCArray<LatLng>|Array<LatLng|LatLngLiteral>} path
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 * @param {Number} type The leg type. This translates to the zIndex and defaults to 40. Higher type means the leg
 * is shown in the foreground of legs elements with lower type.
 */
s11.geomodel.Route.prototype.addLegFromLatLong = function (path, legName, type) {

    if (!type) {
        type = 40;
    }
    var leg = factory.createPolyline({
        path: path,
        strokeColor: this.getColor(),
        strokeOpacity: 0.5,
        strokeWeight: 3,
        length: factory.computeLength(path) / 1000,
        zIndex: type
    });

    this.addLeg(leg, legName);

};

/**
 * Adds a leg to the route. 
 * @param {Object[]} jsonLineStrings An array that contains the leg as GeoJSON LineString objects.
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 */
s11.geomodel.Route.prototype.addLegFromGeoJSON = function (jsonLineStrings, legName, legText, legLink) {

    jsonLineStrings.forEach(function (feature) {
        feature.strokeColor = this.getColor();
        feature.strokeOpacity = 0.5;
        feature.strokeWeight = 3;

        this.addLeg(feature, legName, legText, legLink);

    }, this);

};

/**
 * Adds a leg to the route. 
 * @param {String} encodedPath The path as an  <a href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm">encoded Google Maps polyline</a>
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 */
s11.geomodel.Route.prototype.addLegFromEncodedPath = function (encodedPath, legName) {
    var decodedPath = factory.decodePath(encodedPath);
    this.addLegFromLatLong(decodedPath, legName);

};

/**
 * Adds a leg to the route via queriyng the Google Maps API directions service.<br>
 * This method takes an array of String waypoints and queries the given {@code google.maps.DirectionsService} object. 
 * If not travelMode is supplied, {@code google.maps.TravelMode.TRANSIT} is used.<br>
 * There is no time information included in the request, and there is no guarantee for a specific route that can be 
 * taken. All the method does is trying to add a leg that somehow connects the waypoints with each other in the given 
 * order. Also, Google seems to have chosen to not display the geographically exact path for public transport, but 
 * rather connect the stops with each other by straight lines. So especially for train / bus rides having long sections 
 * without stops, this will not show a realistic geographical route.<br>
 * If the service query is not successful, an alert window is shown showing the cause.<br>
 * This method should be only be used in runtime if there is no other way to retrieve a route. It may be better used as 
 * a helper function during development, to retrieve an appropriate leg which is then persisted as e.g. an encoded path
 * which can be used thereafter.
 * 
 * @param {google.maps.DirectionsService} directionsService
 * @param {String[]} waypoints Describing the route that shall be queried for. E.g. quering the route from Frankfurt 
 * to Moscow via Warszaw: waypoints = ["Frankfurt", "Warszwaw", "Moscow"]
 * @param {google.maps.TransitMode} travelMode The travel mode. Default is {@code google.maps.TravelMode.TRANSIT}
 * on.
 */
s11.geomodel.Route.prototype.addLegFromDirectionsService = function (directionsService, waypoints, travelMode) {

    var route = this;
    var accuPath = [];
    var origin = waypoints[0];
    var destination = waypoints[waypoints.length - 1];
    var numWaypoints = waypoints.length - 1;

    log("Adding leg via directions from " + origin + " to " + destination);

    if (!travelMode) {
        travelMode = google.maps.TravelMode.TRANSIT;
    }

    //Currently (v3) the Google Maps API does not support waypoints for transit requests, so it is necessary to loop 
    //the waypoints and query the directions service for the different segments.
    for (i = 1; i <= numWaypoints; i++) {
        var curOrigin = waypoints[i - 1];
        var curDestination = waypoints[i];

        var request = createDirectionsRequest(curOrigin, curDestination, travelMode);
        directionsService.route(request, directionsServiceCallback);
    }

    function directionsServiceCallback(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            handleRouteResponse(response);
        } else {
            if (status === "ZERO_RESULTS" && response.request.travelMode !== google.maps.TravelMode.DRIVING) {
                window.alert('Could not find route for section ' + response.request.origin + ' to ' +
                        response.request.destination + '. Falling back to driving');

                var request = createDirectionsRequest(response.request.origin, response.request.destination, google.maps.TravelMode.DRIVING);
                directionsService.route(request, directionsServiceCallback);
                return;

            }
            window.alert('Directions request failed due to ' + status);
        }
    }

    var responseCounter = 0;
    var waypointToPathMap = {};

    /**
     * Handles the response retrieved from the directions service.<br>
     * A response contains a leg, which contains steps. Refer to the Google Maps API reference for 
     * further information. For each step, the given path is extracted and added to the overall path. After all 
     * responses have been received, the path is added as a leg to the route object.
     * @param {DirectionsResult} response
     */
    function handleRouteResponse(response) {
        responseCounter++;
        var steps = response.routes[0].legs[0].steps;
        var curOrigin = response.request.origin;
        var curDestination = response.request.destination;
        var accuStep = [];
        log("Received directions step from " + curOrigin + " to " + curDestination);

        steps.forEach(function (step) {
            step.path.forEach(function (pathSegment) {
                accuStep.push(pathSegment);
            });
        });

        waypointToPathMap[curOrigin] = accuStep;

        if (responseCounter === numWaypoints) {
            waypoints.forEach(function (waypoint) {
                var curSegment = waypointToPathMap[waypoint];
                if (curSegment) {
                    accuPath.push(curSegment);
                }
            });
            route.addLegFromLatLong(pathFolder.foldPath(accuPath), origin + " to " + destination,
                    origin + " to " + destination);
        }

    }

};

//TODO remove or test and document
s11.geomodel.Route.prototype.getRouteEndpoint = function () {
    var legs = this.getLegs();
    var lastLeg = legs[this.getLegs().length - 1];
    var legPath = lastLeg.getPath();

    var endpoint = legPath.getAt(legPath.length - 1);
    return endpoint;
};

//+++++++++++++++++++++++++++++++
//Private feature functions and helper objects
//+++++++++++++++++++++++++++++++

/**
 * Sets the given map to the given list of features
 * @param {s11.geomodel.Feature[]} features List of features
 * @param {google.maps.Map} map The map
 */
var setFeatureMap = function (features, map) {
    features.forEach(function (feature) {
        feature.setMap(map);
    });
};


//An object that folds a given array of paths into one path
var pathFolder = (function () {
    var foldedPath = [];

    var doFoldPath = function (pathArray) {
        pathArray.forEach(function (pathSegment) {
            pathSegment.forEach(function (point) {
                foldedPath.push(point);
            });
        });
        return foldedPath;

    };
    return {
        /**
         * Folds the given array of paths into one path (array of google.maps.LatLng)
         * @param {MVCArray<LatLng>[]|Array<LatLng|LatLngLiteral>[]} pathArray
         * @returns {Array}
         */
        foldPath: function (pathArray) {
            foldedPath = [];
            return doFoldPath(pathArray);
        }
    };
})();


//TODO util 
/**
 * Creates a DirectionsRequest object. When the travel mode is transit, {@code google.maps.TransitMode.TRAIN} is used 
 * as the transit mode.
 * @param {String} curOrigin
 * @param {String} curDestination
 * @param {google.maps.TransitMode} travelMode The travel mode
 * @returns {google.maps.DirectionsRequest}
 */
var createDirectionsRequest = function (curOrigin, curDestination, travelMode) {
    return {
        origin: curOrigin,
        destination: curDestination,
        travelMode: travelMode,
        transitOptions: {
            departureTime: new Date(),
            modes: [google.maps.TransitMode.TRAIN],
            routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
        }
    };
};

/**
 * Higlights a route leg.
 */
var highlightPath = function () {
    this.setOptions({
        strokeWeight: 5,
        strokeOpacity: 1
    });
};

/**
 * Unhiglights a route leg.
 */
var unhighlightPath = function () {
    this.setOptions({
        strokeWeight: 3,
        strokeOpacity: 0.5
    });
};

/**
 * Higlights a region.
 */
function highlightRegion() {
    this.parentRegion.getParts().forEach(function (part) {
        part.setOptions({
            strokeWeight: 1,
            strokeOpacity: 1
//            fillOpacity: 0.5
        });
    });
}



/**
 * Unhiglights a region.
 */
function unhighlightRegion() {

    this.parentRegion.getParts().forEach(function (part) {
        part.setOptions({
            //strokeWeight: 1.5,
            strokeOpacity: 0,
            fillOpacity: 0.0
        });
    });
}


var showPlaceTooltip = function () {
    var pos = this.getPosition();

    s11.tooltip.showOnMapPosition(pos, this.name, 0);

};

var showRouteTooltip = function (event) {
    var pos = event.latLng;
    s11.tooltip.showOnMapPosition(pos, this.name, 30);
};















