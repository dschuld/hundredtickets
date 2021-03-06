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
 * @fileoverview This file implements the main functionality for loading and displaying routes and regions from an 
 * external data source.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
var async = async || {};

var routes_regions_PLUGIN_ID = "routes_regions";

var getRegionDef = function (row) {

    var regionDef = {
        name: row[0],
        text: row[1],
        link: row[2],
        type: row[3],
        within: row[4]
    };

    for (i = 5; i <= 8; i++) {
        if (row[i]) {
            regionDef.geoJson = parseGeoJson(row[i]);
            return regionDef;
        }
    }

    //TODO throw exception
};

var parseGeoJson = function (jsonText) {
    var json = $.parseJSON(jsonText);
    return s11.util.loadGeoJSON(json, {
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#AAAAAA",
        fillOpacity: 0.5
    });
};

//TODO for JSON route loading (e.g. rivers)
var routeDataHandlerJson = function (curRoute, data, map, callback) {
    if (!data.rows) {
        return;
    }
    data.rows.forEach(function (row) {
        if (row[0]) {
            var geoJson = parseGeoJson(row[0]);
            curRoute.addLegFromGeoJSON(geoJson, "Mekong", "", "");
            log("Adding leg " + row[1]);
        }

    });
    curRoute.setMap(map);

    if (callback) {
        callback(null, 'route');
    }
};

function queryRoutes(appData) {

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
            KeyConditionExpression: "route = :v1",
            IndexName: 'route-index',
            TableName: appData.tripOptions.routesTableName
        };
        
        var routes = [];

        dynamodb.query(queryParams, function (err, result) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {

                result.Items.forEach(function (item) {
                    var routeId = item.route.N - 1;
                    if (!routes[routeId]) {
                        routes[routeId] = new s11.geomodel.Route(item.color);
                        routes[routeId].setMap(appData.map);
                    }
                });

                result.Items.forEach(function (item) {
                    var route = routes[item.route.N - 1];
                    route.addLegFromEncodedPath(item.encoded.S, item.name.S);
                    var leg = route.getLegs()[route.getLegs().length - 1];
                    leg.infoWindowContentProvider = s11.ui.getContentProvider(item.content? item.content.S : null, item.name.S, appData.wpApi);
                    appData.factory.addEventListener(leg, 'click', s11.ui.InfoWindow.show);
                    log("Adding leg " + item.name);
                });

            }
        });
        
        s11.pluginLoader.onLoad(places_PLUGIN_ID, true);    


}




//TODO refactoring for routes, color in FuTa
var routeDataHandler = function (data, appData, callback) {
    if (!data.rows) {
        return;
    }

    var routes = [];

    data.rows.forEach(function (row) {
        var routeId = row[0] - 1;
        if (!routes[routeId]) {
            routes[routeId] = new s11.geomodel.Route(row[4]);
            routes[routeId].setMap(appData.map);
        }
    });

    data.rows.forEach(function (row) {
        if (row[0]) {
            var route = routes[row[0] - 1];
            route.addLegFromEncodedPath(row[1], row[2]);
            var leg = route.getLegs()[route.getLegs().length - 1];
            leg.infoWindowContentProvider = s11.ui.getContentProvider(row[3], row[2], appData.wpApi);
            appData.factory.addEventListener(leg, 'click', s11.ui.InfoWindow.show);
            log("Adding leg " + row[2]);
        }

    });


    appData.trip.addRoutes(routes);

    if (callback) {
        callback(null, 'route');
    }
};


function regionDataHandler(data, appData, callback) {

    if (!data.rows) {
        return;
    }
    data.rows.forEach(function (row) {
        if (row[0]) {

            var regionDef = getRegionDef(row);
            log("Adding region: " + row[0]);
            var region = new s11.geomodel.Region(appData.tripOptions.regions.color);
            region.addParts(regionDef);
            region.setMap(appData.map);
            appData.trip.addRegions(region);

        }
    });
    
    var zoomTracker = function(regions, map) {
        
        var curZoom = 1;
        return function() {
            if (curZoom <= 8 && map.getZoom() > 8) {
                regions.forEach(function(region) {
                    region.setVisible(false);
                });
                
            } else if (curZoom > 8 && map.getZoom() <= 8) {
                regions.forEach(function(region) {
                    region.setVisible(true);
                });
            }
            
            curZoom = map.getZoom();
        };
    };
    
    appData.factory.addEventListener(appData.map, 'zoom_changed', zoomTracker(appData.trip.getRegions(), appData.map));
    

    callback(null, 'region');

}
//
//Ulan Ude, Ulan Bator, Zamiin-Uud
//Erenhot, Ulanqab, Beijing, Jinan, Shanghai, chengdu, lijian, dali, kunming, honghe, hekou
//ga Dong Dang, Hanoi, da nang, phu cat, nha trang, saigon
//saigon, pnomh penh, siem reap, bangkok

function addRoutesAndRegions(appData) {
    var tripOptions = appData.tripOptions;

    var dataProvider = new s11.data.DataProvider(tripOptions.fusionTableApiKey, tripOptions.routeDataTableId,
            tripOptions.regionDataTableId, tripOptions.placeDataTableId);
//    var mekongRoute = new s11.geomodel.Route(tripOptions.routes[1].color);

    queryRoutes(appData);
    
    s11.pluginLoader.onLoad(routes_regions_PLUGIN_ID, true);

}


s11.pluginLoader.addPlugin(routes_regions_PLUGIN_ID, function (appData) {
    addRoutesAndRegions(appData);
});

//MovingMarker
//        var route = trip.getRoutes()[0];
//        var leg = route.getLegs()[0];
//        var path = leg.getPath();
//        var startPoint = path.getAt(0);
//
//        var markerOpts = {
//            name: "",
//            text: "",
//            link: "",
//            position: startPoint,
//            icon: 'http://freefavicons.org/download/toy-train/toy-train.png'
//        };
//TODO own plugin and deactivate
//        var marker = factory.createMarker(markerOpts);
//        var movingMarker = new s11.geomodel.MovingMarker(marker);
//        movingMarker.setMap(map);
//        movingMarker.moveAlongRoute(route);