/* 
 * Copyright 2015 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless  required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var CONF_TEST = './tripOptions.json';
var CONF_PROD = '../config/tripOptions.json';


var gulp = require('gulp');
var changed = require('gulp-changed'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        imagemin = require('gulp-imagemin'),
        clean = require('gulp-clean'),
        htmlmin = require('gulp-htmlmin'),
        cssnano = require('gulp-cssnano');

var devDir = process.env.LOCAL_DEV_THEME_DIR;
var prodDir = process.env.LOCAL_PROD_THEME_DIR;


gulp.task('default', ['scripts', 'conf', 'cssnano', 'htmlmin'], function () {
    //default aggregator
});

gulp.task('scripts-non-ugly', function () {
    return gulp.src(["./js/libs/async/async.js", "./js/libs/markerclusterer/markerclusterer_compiled.js", "./js/libs/geojson/GeoJSON.js", "./js/pluginLoader.js", "./js/wpApi.js", "./js/FuTa.js", "./js/featurefactory.js", "./js/util.js", "./js/InfoWindow.js", "./js/geomodel.js", "./js/s11_controls.js", "./js/data.js", "./js/s11.js", "./js/locationIndicator.js", "./js/photoFeed.js", "./js/places.js", "./js/routes_regions.js", "./js/help-control.js"])
            .pipe(changed('./../dist/'))
            .pipe(concat('all.js'))
            .pipe(gulp.dest('./../dist/'));
});

gulp.task('scripts', ['scripts-non-ugly'], function () {
    return gulp.src(['./../dist/all.js'])
            .pipe(uglify())
            .pipe(gulp.dest('./../dist/'));
});

gulp.task('conf', function () {
    return gulp.src(['../config/*.json'])
            .pipe(gulp.dest('./../dist/'));
});

gulp.task('cssnano', function () {
    return gulp.src(['./maps-style.css'])
            .pipe(changed('./../dist/'))
            .pipe(cssnano())
            .pipe(gulp.dest('./../dist/'));
});

gulp.task('htmlmin', function () {

    return gulp.src(['./index.html', './transit-gen.html', './location.html', './index_cn.html', './transit-gen_cn.html', './location_cn.html'])
            .pipe(changed('./../dist/'))
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest('./../dist/'));
});

gulp.task('jshint', function () {
    return gulp.src(["./js/util.js", './js/featurefactory.js', './js/FuTa.js', './js/data.js', './js/geomodel.js', "./js/s11_controls.js", './js/s11.js', "./js/locationIndicator.js", "./js/photoFeed.js", "./js/places.js", "./js/routes_regions.js"])
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});


gulp.task('deploy-themes', ['deploy-theme-prod','deploy-theme-dev'], function () {
    //aggregator task

});

/*
 * Deploys the uglified sources to the wordpress theme
 */
gulp.task('deploy-theme-prod', ['default'], function () {
    gulp.src(['./../dist/all.js', './../dist/*.json'])
            .pipe(gulp.dest(prodDir + '/js'));

    return gulp.src(['./../dist/maps-style.css'])
            .pipe(gulp.dest(prodDir));

});


/*
 * Deploys the non-uglified sources to the wordpress theme 
 */
gulp.task('deploy-theme-dev', ['scripts-non-ugly', 'conf'], function () {
    gulp.src(['./../dist/all.js'])
            .pipe(gulp.dest(devDir + '/js'));

    gulp.src(['./maps-style.css'])
            .pipe(gulp.dest(devDir));

    return  gulp.src(['./../dist/*.json'])
            .pipe(gulp.dest(devDir + '/js'));
});

gulp.task('deploy-local-appengine', function () {
    return gulp.src(['./../dist/**'])
            .pipe(changed('C:/dev/workspace-appengine/singapore/src/main/webapp'))
            .pipe(gulp.dest('C:/dev/workspace-appengine/singapore/src/main/webapp'));
});






