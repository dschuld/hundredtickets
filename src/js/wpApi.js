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
 * @fileoverview This file connects to the Wordpress REST API.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
s11.wpapi = s11.wpapi  || {};
/**
 * 
 * @constructor 
 */
s11.wpapi.WordpressConnector = function (baseUrl, restApiPath) {

    /**
     * @type {String}
     */
    var restUrl = baseUrl + restApiPath;
    
    /**
     * @type {String}
     */    
    var baseUrl = baseUrl;
    

    /**
     * Returns functions for retrieving the URL and the post preview.
     * TODO implement error handling
     */ 
    return {
        getRestUrl: function () {
            return restUrl;
        },
        getBaseUrl: function() {
            return baseUrl;
        },
        /**
         * Retrieves the post preview from the WP REST API according to given slug and passes it to the callback.
         */        
        getPost: function (slug, callback) {
            $.ajax({
                url: restUrl + '?slug=' + slug,
                type: 'get',
                success: function (result) {
                   callback(result[0].excerpt.rendered);
                }
            });
        }



    };



};


