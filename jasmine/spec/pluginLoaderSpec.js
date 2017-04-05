/* 
 * Copyright 2017 david.
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
 * @fileoverview This tests the plugin loader component.
 * @author davidschuld@gmail.com (David Schuld)
 */

describe("Plugin Loader", function () {
    var loader = s11.pluginLoader;
    var plugin_id_1 = "plugin1";
    var plugin_id_2 = "plugin2";
    var expectedPluginList = "Plugins: plugin1:LOADING, plugin2:LOADING, ";
    var expectedPluginListAfterLoad = "Plugins: plugin1:ACTIVE, plugin2:FAILED, ";

    var data = function () {

        return {
            log: function () {
                //empty mock
            }
        };
    }();


    it("initializes", function () {
        spyOn(loader, "logPluginList");
        spyOn(data, "log");
        loader.init(data);
        expect(data.log).toHaveBeenCalled();
        expect(loader.logPluginList).toHaveBeenCalled();
    });
    
    
    it("adds plugins", function () {
        var result;
        loader.addPlugin(plugin_id_1, function(data) {
            result = data;
        });
        loader.addPlugin(plugin_id_2, function(data) {
            result = data;
        });
        expect(result).toBe(data);
    });    
        
    it("lists plugins", function () {
        var pluginList = loader.listPlugins();
        expect(pluginList).toBe(expectedPluginList);
    });
            
    it("loads plugins", function () {
        loader.onLoad(plugin_id_1, true);
        loader.onLoad(plugin_id_2, false);
        var pluginList = loader.listPlugins();
        expect(pluginList).toBe(expectedPluginListAfterLoad);
    });
    

});