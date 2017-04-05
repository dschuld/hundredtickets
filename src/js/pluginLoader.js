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
 * @fileoverview This file implements the pluginLoader object, which provides hooks to add additional 
 * functionality to the map application.
 * @author davidschuld@gmail.com (David Schuld)
 */
var s11 = s11 || {};
s11.plugin = s11.plugin || {};

s11.plugin.STATES = {
    REGISTERED: "REGISTERED",
    LOADING: "LOADING",
    FAILED: "FAILED",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
};

var STATES = s11.plugin.STATES;

/**
 * This object is the central registry for all aditional functionality of the map. Plugins can register at any time 
 * via the addPlugin() function. When the map is loaded, the init() function is called and the map data is dispatched 
 * to all registered plugins.
 * 
 */
s11.pluginLoader = function () {

    var pluginCallbacks = {};
    var pluginStates = {};

    var data;
    var doLoad = function () {
        var id;
        for (id in pluginCallbacks) {
            setState(id, STATES.LOADING);
            pluginCallbacks[id](data);
        }
    };

    var setState = function (id, state) {
        pluginStates[id] = state;
        if (data) {
            data.log(id + ": " + state);
        }
    };

    return {
        addPlugin: function (id, callback) {
            pluginCallbacks[id] = callback;
            setState(id, STATES.REGISTERED);
            if (data) {
                setState(id, STATES.LOADING);
                callback(data);
            }
        },
        logPluginList: function () {
            data.log(this.listPlugins());
        },
        listPlugins: function () {
            var message = "Plugins: ";
            var id;
            for (id in pluginCallbacks) {
                message += id + ":" + pluginStates[id] + ", ";
            }

            return message;
        },
        init: function (dataObject) {
            data = dataObject;
            data.log("Initialized plugin loader");
            this.logPluginList();
            doLoad();
        },
        onLoad: function (id, result) {
            if (result) {
                setState(id, STATES.ACTIVE);
            } else {
                setState(id, STATES.FAILED);
            }
        }
    };

}();
