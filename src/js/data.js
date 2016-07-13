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
 * @fileoverview This file contains the s11.data namespace. It provides methods for requesting the trip data.
 * @author davidschuld@gmail.com (David Schuld)
 */
var s11 = s11 || {};
s11.data = s11.data || {};

s11.data.type = {
    ROUTE: 40,
    POI: 30,
    PROVINCE: 20,
    COUNTRY: 10
};

s11.data.DataProvider = function (key, routeDataTableId, regionDataTableId, placesDataTableId) {

    routeTable = new s11.data.FusionTable(routeDataTableId, {
        key: key

    });
    regionTable = new s11.data.FusionTable(regionDataTableId, {
        key: key

    });
    placesTable = new s11.data.FusionTable(placesDataTableId, {
        key: key

    });

    return {
        selectAllVisibleRoutes: function (callback) {

            routeTable.select("route, encoded,name,content,color,ordering").where("route>0").orderBy("ordering").execute(callback);
        },
        selectAllPlannedLegs: function (callback) {

            routeTable.select("encoded,name,content,ordering").where("route=1").orderBy("ordering").execute(callback);
        },
        selectAllActualLegs: function (callback) {

            routeTable.select("encoded,name,content,ordering").where("route=2").orderBy("ordering").execute(callback);
        },
        selectVisibleRegions: function (callback) {

            regionTable.select("name,text,link,type,within,custom_json,json_countries,json_provinces,json_lakes").where("visible=1").orderBy("type asc").execute(callback);
        },
        selectVisiblePlaces: function (callback) {

            placesTable.select("name,content,icon,location, zoom").where("visible=1").orderBy("name desc").execute(function (data) {
                callback(data);
            });
        }
    };

};

var makeAddress = function (statement1, statement2, tableId, callback, key) {
    var address = "https://www.googleapis.com/fusiontables/v2/query?sql=" + statement1 + tableId + statement2;
    if (callback) {
        address += "&callback=" + callback;
    }
    if (key) {
        address += "&key=" + key;
    }
    return address;
};

var callFusionTableApi = function (statement1, statement2, tableId, callback) {
    var script = document.createElement("script");
    script.setAttribute("src", makeAddress(statement1, statement2, tableId, callback, key));
    document.head.appendChild(script);
};

s11.data.insert = function (type, visible, name, text, link, icon, encoded, json) {
    var columns = " (type";
    var values = " VALUES (" + type;
    if (!type) {
        //throw exception
        return;
    }

    if (visible === 1 || visible === 0) {
        columns += ",visible";
        values += "," + visible;
    }
    if (name) {
        columns += ",name";
        values += ",'" + name + "'";
    }
    if (text) {
        columns += ",text";
        values += ",'" + text + "'";
    }
    if (link) {
        columns += ",link";
        values += ",'" + link + "'";
    }
    if (icon) {
        columns += ",icon";
        values += ",'" + icon + "'";
    }
    if (encoded) {
        columns += ",encoded";
        values += ",'" + encoded + "'";
    }
    if (json) {
        columns += ",json";
        values += ",'" + json + "'";
    }
    columns += ")";
    values += ")";

    var address = makeQuery("INSERT INTO ", columns + values);

    send("https://www.googleapis.com/fusiontables/v2/query", address);

};

function makeQuery(statement1, statement2) {
    var address = statement1 + routeDataTableId + statement2;
    return encodeURIComponent(address);
}


//TODO jquery ajax
function send(url, query) {
    var http = new XMLHttpRequest();
    var params = "sql=" + query;
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Authorization", "Bearer ya29.NAJPJzpZLprUzPjamDbFednMn36ujP145-BUx0_ETNBnnwr-jXdBlkizfU1_y0USgAET");

    http.onreadystatechange = function () {//Call a function when the state changes.
        console.log(http.responseText);
        if (http.readyState === 4) {
            if (http.status === 200) {
                var json = JSON.parse(http.responseText);
                alert("Inserted new row with rowId " + json.rows[0][0]);
            } else {
                alert(http.responseText);
            }
        }
    };
    http.send(params);
}

//for bulk ploygon insert, use import instead

//read from table --> function that adds script attribute

//statistics functions


