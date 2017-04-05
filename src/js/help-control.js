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
 * @fileoverview This file adds a help control that shows a popup with information about the app.
 * @author davidschuld@gmail.com (David Schuld)
 */


var s11 = s11 || {};

var helpControl_PLUGIN_ID = "helpControl";

var showHelp = function (appData, aboutWindow) {

    var toggleHelp = function () {
        var displayValue = 'block';

        return function () {

            aboutWindow.css({
                'display': displayValue
            });

            if (displayValue === 'block') {
                displayValue = 'none';
            } else {
                displayValue = 'block';
            }

        };
    }();


    appData.controls.add("https://drive.google.com/uc?export=download&id=0B48vYXs63P2lbUFBeFRYX2g5ZDA",
            "What is this all about?", function (e) {

               toggleHelp();
            });





};

var appendDiv = function (parentElement, id, classes) {
    parentElement.append("<div id='" + id + "' ></div>");

    var newDiv = $("#" + id);

    classes.forEach(function (cssClass) {
        newDiv.addClass(cssClass);
    });

    return newDiv;
};


s11.pluginLoader.addPlugin(helpControl_PLUGIN_ID, function (data) {

    var aboutWindowDiv = appendDiv($("#googleMap"), "about-window", ["gm-style-iw"]);

    var aboutWindowContent = appendDiv(aboutWindowDiv, "about-window-content", ["about-window-content"]);

    aboutWindowContent.html("This website is about my trip from Frankfurt to Southern Asia. You can read a <a href='" +data.wpApi.getBaseUrl() + "/a-hundred-tickets-to-bangkok' class='more-link'>blog post</a> for more info about the trip.<br><p>You can use the map to look at the route that I am taking, the places I have been to, photos, and a lot more. Many items on the map are clickable and show you some info or pictures. Somethimes there is also a corresponding blog post, which will be loaded when you click the 'Continue Reading' link.<p>The map shows the route I have already travelled and the route that I am planning to take, and the 'Find Me' button on the top of the map shows the place where I am right now.<br><p>If you just want to look at the blog posts without the map, click 'Hide Map' in the menu bar or scroll down in the area below the map. To show the map again, click 'Show Map' or scroll to the top of the page.");



    var aboutWindowFooter = appendDiv(aboutWindowDiv, "about-window-footer", ["about-window-footer"]);
    appendDiv(aboutWindowFooter, "about-window-divider-1", ["about-window-button"]);
    var aboutWindowCloseButton = appendDiv(aboutWindowFooter, "about-window-close-button", ["about-window-button"]);
    aboutWindowCloseButton.html("<a href='#'>Close</a>");
    appendDiv(aboutWindowFooter, "about-window-divider-2", ["about-window-button"]);


    aboutWindowCloseButton.click(function () {
        $("#about-window").css({
            'display': 'none'
        });
    });

    aboutWindowCloseButton.css('cursor', 'pointer');


    showHelp(data, aboutWindowDiv);
});