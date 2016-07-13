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

var s11 = s11 || {};
s11.controls = s11.controls || {};
var factory = s11.geomodel.getFactory();

s11.controls.ControlsContainer = function (map) {


    var centerControlDiv = document.createElement('div');
    $(centerControlDiv).addClass("control-container").attr("id", "top-center-controls");

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    var controls = [];

    return {
        "add": function (iconPath, text, callback) {

            var centerControl = new s11.controls.Control(centerControlDiv, iconPath, text, callback);
            controls.push(centerControl);

        },
        "getAll": function () {
            return controls;
        }
    };
};

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
s11.controls.Control = function (controlDiv, iconPath, text, callback) {

    var controlUI = document.createElement('div');
    $(controlUI).addClass("control-div");
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    $(controlText).addClass("control-button-div").css("background-image", 'url("' + iconPath + '")');
    controlUI.appendChild(controlText);

    controlText.addEventListener('click', function (e) {
        callback(e);
    });
    $(controlText).hover(s11.tooltip.showFromEvent(text), s11.tooltip.hide);





};

var createShowTooltip = function (text) {
    return function (e) {
        var tt = $('#gm-style-tt');
        tt = tt.html(createTooltipContent(text)).css({
            'left': e.pageX + 10,
            'top': e.pageY + 10
        });
        tt.show();

    };
};
