/* 
 * Copyright 2015 David Schuld.
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



var async = async || {};
var baseScripts1 = ["./js/libs/markerclusterer/markerclusterer_compiled.js", "./js/libs/geojson/GeoJSON.js", "./js/pluginLoader.js", "./js/featurefactory.js"];
var baseScripts2 = ["./js/util.js", "./js/InfoWindow.js"];
var baseScripts3 = ["./js/geomodel.js", "./js/data.js"];
var mainScript = ["./js/s11.js"];
var pluginScripts = ["./js/photoFeed.js"];

var loadScript = function (script, onLoadFunction) {
    var scriptElement = document.createElement("script");
    scriptElement.onload = onLoadFunction;
    scriptElement.setAttribute("src", script);
    document.head.appendChild(scriptElement);
    return scriptElement;
};

var createParallelFunctions = function (scripts) {

    return scripts.map(function (scriptName, index, scriptsArray) {
        return function (callback) {
            var script = loadScript(scriptName, function () {
                callback(null, script);
            });
        };
    });

};

var createParallelFunctionsCallback = function (scripts) {
    return function (callback) {
        async.parallel(createParallelFunctions(scripts), function (err, result) {
            callback(null, scripts);
        });
    };
};

loadScript("./js/libs/async/async.js", function () {
    async.series([createParallelFunctionsCallback(baseScripts1),
        createParallelFunctionsCallback(baseScripts2),
        createParallelFunctionsCallback(baseScripts3),
        function (callback) {
            loadScript("./js/s11.js", function () {
                callback(null, 'mainScript');
            });
        }, createParallelFunctionsCallback(pluginScripts)]);

});
