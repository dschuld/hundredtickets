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
 * @fileoverview This tests the Wordpress REST API connector.
 * @author davidschuld@gmail.com (David Schuld)
 */

describe("WP REST API", function () {
    var wpApi;
    var baseUrl = "https://BASE-URL";
    var restApiPath = "restApi";

    beforeEach(function () {
        wpApi = new s11.wpapi.WordpressConnector(baseUrl, restApiPath);
        $ = function () {
            return {
                ajax: function (params) {
                    var excerpt = {
                        rendered: "EXCERPT-MOCK"
                    };
                    params.success([{excerpt}]);
                }
            };
        }();
    });

    it("returns the correct restUrl", function () {
        var actualRestUrl = wpApi.getRestUrl();
        expect(actualRestUrl).toEqual(baseUrl + "/" + restApiPath);

    });

    describe("- Async", function () {

        it("calls the API asynchronously", function () {
            var post;
            wpApi.getPost("test", function (param) {post = param;});

            expect(post).toEqual("EXCERPT-MOCK");

        });

    });
});

