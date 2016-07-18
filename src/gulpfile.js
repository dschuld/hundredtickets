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
var SERVER_DOMAIN = 'u85399740.1and1-data.host';
var SERVER_WP_USER = 'u85399740';
//var PK_FILE = 'XXXX';
var SERVER_WP_THEMES_DIR = '/clickandbuilds/AHundredTicketstoBangkok/wp-content/themes';
var LOCAL_WORDPRESS_THEME_DIR = '/home/david/dev/theme/twentythirteen-hundredtickets-dev/';
var LOCAL_WORDPRESS_PROD_THEME_DIR = '/home/david/dev/theme/twentythirteen-hundredtickets/';


var gulp = require('gulp');
var changed = require('gulp-changed'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        imagemin = require('gulp-imagemin'),
        clean = require('gulp-clean'),
        htmlmin = require('gulp-htmlmin'),
        cssnano = require('gulp-cssnano'),
        scp = require('gulp-scp2'),
        fs = require('fs'),
        GulpSSH = require('gulp-ssh');

var config = {
    host: SERVER_DOMAIN,
    port: 22,
    username: SERVER_WP_USER,
//    privateKey: fs.readFileSync(PK_FILE)
    password: 'XXXXX'
};


var ssh = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config
});

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
            .pipe(changed('./../dist/'))
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


gulp.task('deploy-themes', ['deploy-wordpress-prod','deploy-wordpress-dev'], function () {
    //aggregator task

});

/*
 * Deploys the uglified sources to the wordpress theme
 */
gulp.task('deploy-wordpress-prod', ['default'], function () {
    gulp.src(['./../dist/all.js', './../dist/*.json'])
            .pipe(gulp.dest(LOCAL_WORDPRESS_PROD_THEME_DIR + '/js'));

    return gulp.src(['./../dist/maps-style.css'])
            .pipe(gulp.dest(LOCAL_WORDPRESS_PROD_THEME_DIR));

});


/*
 * Deploys the non-uglified sources to the wordpress theme 
 */
gulp.task('deploy-wordpress-dev', ['scripts-non-ugly', 'conf'], function () {
    gulp.src(['./../dist/all.js'])
            .pipe(gulp.dest(LOCAL_WORDPRESS_THEME_DIR + '/js'));

    gulp.src(['./maps-style.css'])
            .pipe(gulp.dest(LOCAL_WORDPRESS_THEME_DIR));

    return  gulp.src(['./../dist/*.json'])
            .pipe(gulp.dest(LOCAL_WORDPRESS_THEME_DIR + '/js'));
});

gulp.task('deploy-local-appengine', function () {
    return gulp.src(['./../dist/**'])
            .pipe(changed('C:/dev/workspace-appengine/singapore/src/main/webapp'))
            .pipe(gulp.dest('C:/dev/workspace-appengine/singapore/src/main/webapp'));
});


gulp.task('scp-test', function () {
    gulp.src([LOCAL_WORDPRESS_THEME_DIR + '/**'])
            .pipe(scp({
                host: SERVER_DOMAIN,
                username: SERVER_WP_USER,
                privateKey: fs.readFileSync(PK_FILE),
                dest: SERVER_HOME_DIR
            }))
            .on('error', function (err) {
                console.log(err);
            });
});



gulp.task('deploy-production', function () {

    ssh.exec(['rm -rf ' + SERVER_WP_THEMES_DIR + '/twentythirteen-hundredtickets'], {filePath: 'D:/Benutzer-Profile/schuldd/commands.log'});

    return gulp.src([LOCAL_WORDPRESS_THEME_DIR + '/**'])
            .pipe(ssh.dest(SERVER_WP_THEMES_DIR + '/twentythirteen-hundredtickets'));
});


gulp.task('sftp-write', function () {
  return gulp.src(['./gulpfile.js'])
    .pipe(ssh.sftp('write', SERVER_HOME_DIR));
});

gulp.task('ssh-test', function () {

//    ssh.exec(['rm -rf ' + SERVER_HOME_DIR + '/twentythirteen-s11-integrated'], {filePath: 'D:/Benutzer-Profile/schuldd/commands.log'});

//    ssh.exec(['mkdir test'], {filePath: 'D:/Benutzer-Profile/schuldd/commands.log'});
    ssh.exec(['ls -la'], {filePath: 'logs/commands.log'});
    ssh.exec(['touch test.txt'], {filePath: 'logs/commands.log'});

    return gulp.src(['C:/windows-version.txt'])
            .pipe(ssh.dest(SERVER_HOME_DIR));
});


gulp.task('jshint', function () {
    return gulp.src(["./js/util.js", './js/featurefactory.js', './js/FuTa.js', './js/data.js', './js/geomodel.js', "./js/s11_controls.js", './js/s11.js', "./js/locationIndicator.js", "./js/photoFeed.js", "./js/places.js", "./js/routes_regions.js"])
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});


