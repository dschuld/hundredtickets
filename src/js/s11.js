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

//Global variables
var map;
var trip = new s11.geomodel.Trip();
var s11 = s11 || {};
var factory = s11.geomodel.getFactory();
var wpdata = wpdata || {};

var tripOptions;


$(document).ready(function () {
    readOptions();
});

function centerMap(lat, lng) {
    map.setCenter(factory.createLatLng(lat, lng));
}

function readOptions() {


    var optionsUrl = wpdata.tripOptionsUrl ? wpdata.tripOptionsUrl : './tripOptions.json';

    var styleUrl = wpdata.mapStyleUrl ? wpdata.mapStyleUrl : '../config/mapStyle.json';

    $.getJSON(optionsUrl, function (optionsJson) {
        tripOptions = optionsJson;

        $.getJSON(styleUrl, function (styleJson) {
            initialize(styleJson);
        });



    });
}

function initialize(mapStyle) {

    focusser = s11.geomodel.getFocusser();



    map = factory.createMap(tripOptions.initCenter[1], tripOptions.initCenter[0], tripOptions.initZoom, 'googleMap', tripOptions.mapboxKey, tripOptions.mapboxStyle, mapStyle);


    map.setMapTypeId(Math.random() > tripOptions.tileServerRatio ? google.maps.MapTypeId.SATELLITE : s11.util.MapTypeId.MAPBOX_CUST_OUT);

    factory.addEventListener(map, 'click', function (e) {
        toGeoJsonTextFromLatLng(e.latLng);
    });


    //TODO to focus mode plugin
    //Unfocus if zoomed out far enough
    factory.addEventListener(map, 'zoom_changed', function () {
        log("zoom: " + map.getZoom());
        if (map.getZoom() < focusser.get('focusZoom')) {
            var currentFocussedPart = focusser.get('part');
            if (currentFocussedPart) {
                currentFocussedPart.setVisible(true);
            }
            focusser.set('part', null);
        }
    });


    //var controls = new s11.controls.ControlsContainer(map);

    if (!wpdata.restApiPath) {
        wpdata.restApiPath = '/wp-json/wp/v2/posts/';
    }
    if (!wpdata.wpBaseUrl) {
        wpdata.wpBaseUrl = 'http://192.168.1.58/wordpress/';
    }

    AWS.config.apiVersions = {
        dynamodb: '2012-08-10'
    };
    AWS.config.region = 'eu-central-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-central-1:8549458d-24ed-44ea-b5af-66196c3f8e68'
    });
    
    var globalData = {
        "map": map,
        "trip": trip,
        "factory": factory,
        "tripOptions": tripOptions,
        "log": function (message) {
            log(message);
        }
	};


    s11.pluginLoader.init(globalData);

    if (tripOptions.debugWindow) {
        $('#debug-window').html("<textarea id='debug' readonly='true'>").show();
    }

}

s11.tooltip = function () {

    var showFlag = false;

    var createDelayedShow = function (text) {
        return function (e) {
            if (!delay) {
                var delay = 0;
            }

            showFlag = true;

            setTimeout(function () {
                if (!showFlag) {
                    delayFlag = true;
                    return;
                }
                var tt = $('#gm-style-tt');
                tt = tt.html(createTooltipContent(text)).css({
                    'left': e.pageX + 10,
                    'top': e.pageY + 10
                });
                tt.show();
            }, 1000);

        };
    };

    return {
        showOnMapPosition: function (pos, name, offset) {
            var point = s11.util.fromLatLngToPoint(pos, map);
            var tt = $('#gm-style-tt');
            tt = tt.html(createTooltipContent(name)).css({
                'left': point.x + 10,
                'top': point.y - offset
            });
            tt.show();

        },
        showFromEvent: function (text) {

            return createDelayedShow(text);

        },
        hide: function () {
            showFlag = false;
            $('#gm-style-tt').hide();
        }
    };

}();


var createTooltipContent = function (text) {
    return  '<div id="tooltip-content">' + text + '</div>';
};






function toGeoJsonTextFromLatLng(pos) {
    var json = '{"type":"Point","coordinates":[' + pos.lng() + ',' + pos.lat() + ']}';
    log(json);
    return json;
}

function toGeoJsonText(place) {
    var pos = place.getPosition();
    var json = '{"type":"Point","coordinates":[' + pos.lng() + ',' + pos.lat() + ']}';

    return json;
}


var logBuffer = "";
function log(message) {
    var debug = $('#debug');

    if (debug.length === 0) {
        logBuffer += message + "\n";
    } else {

        if (logBuffer) {
            debug.append(logBuffer);
            logBuffer = null;
        }
        debug.val(message + "\n" + debug.val());
    }
    console.log(message);
}

