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
 * @fileoverview This file contains FuTaJS, an object-oriented API for Google Fusion Tables.
 * @author davidschuld@gmail.com (David Schuld)
 */
var s11 = s11 || {};

s11.data = s11.data || {};
s11.data.FusionTable = function (id, fusionTableOpts) {

    var tableId = id;

    if (fusionTableOpts) {
        var bearerId = fusionTableOpts.bearerId;
        var key = fusionTableOpts.key;

    }

    this.select = function (selectStatement) {
        var statement = "SELECT " + selectStatement + " FROM " + tableId;

        var statementExecutor = {
            where: function (whereClause) {
                statement += " WHERE " + whereClause;
                return this;
            },
            groupBy: function (groupByClause) {
                statement += " GROUP BY " + groupByClause;
                return this;
            },
            orderBy: function (orderByClause) {
                statement += " ORDER BY " + orderByClause;
                return this;
            },
            execute: function (callback) {

                var uri = makeURI(statement, key);
                $.get(uri, function (data, status) {
                    if (status === 'success') {
                        callback(data);
                    }
                });

            }

        };

        return statementExecutor;

    };

};

var makeURI = function (statement, key) {
    var address = "https://www.googleapis.com/fusiontables/v2/query?sql=" + statement;
    if (key) {
        address += "&key=" + key;
    }
    return address;
};
