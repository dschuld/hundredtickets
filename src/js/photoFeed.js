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
 * @fileoverview This file implements a functionality to access the public photo feed of a Flickr account. For each 
 * geotagged picture in the feed, a marker is shown on the map that shows a photo thumbnail on click.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};

var photoFeed_PLUGIN_ID = "photoFeed";
var photoDimensionsCache = {};
var markerCacheByTag = {};

var photoFeedWindow = function () {

    return {
        show: function (pos, picture, flickrLink, title, map) {
            var point = s11.util.fromLatLngToPoint(pos, map);
			var w = map.getDiv().offsetWidth;
			var h = map.getDiv().offsetHeight;
			var alignment = {};
			
			
			if (title in photoDimensionsCache && photoDimensionsCache[title]['w'] > 50) {
				var photoHeight = photoDimensionsCache[title]['h'];
				var photoWidth = photoDimensionsCache[title]['w'];
			} else {
				var photoHeight = $('#photoFeed-window').outerHeight();
				var photoWidth = $('#photoFeed-window').outerWidth();
			}   
			
			
			var photoY = point.y > h/2? point.y - photoHeight - 6 : point.y;
			var photoX = point.x  + photoWidth > w? point.x - photoWidth - 6 : point.x;
			
            alignment['top'] = photoY;
		    alignment['left'] = photoX;
		
            var tt = $('#photoFeed-window');
            tt = tt.html(createThumbnailHtml(picture, title, flickrLink)).css(alignment);
            tt.show(0, function() {
				
				var photoWidth = $('#photoFeed-window').outerWidth();
				if ($('#photoFeed-window').outerWidth() > 50) {
					photoDimensionsCache[title]['w'] = $('#photoFeed-window').outerWidth();
					photoDimensionsCache[title]['h'] = $('#photoFeed-window').outerHeight();
				}
				return;
			});
			return;

        },
        hide: function () {
            $('#photoFeed-window').hide();
        }
    };

}();

var createThumbnailHtml = function (picture, title, flickrLink) {
    var imageString = '<a href="' + flickrLink + '"  target="_blank"><img src="' + picture + '" height="auto" width="auto" /></a>';

    var contentString =
            '<div >' + imageString + '<p>' + title + '<br></div>';

    return contentString;
};

var extractLegendTagFromPhotoTags = function(tagString, legend) {
	var tags = tagString.toLowerCase().split(" ");
	var tag = "";
	tags.forEach(function(curTag) {
		var prop = curTag.toLowerCase();
		for(var p in legend){
			if(legend.hasOwnProperty(p) && prop == (p+ "").toLowerCase()) {
				tag = curTag;
			}
		}
	});
	return tag;
}

var getPropertyIgnoreCase = function(prop, obj) {
	var val = "";
	prop = (prop + "").toLowerCase();
	for(var p in obj){
		if(obj.hasOwnProperty(p) && prop == (p+ "").toLowerCase()){
		   val = obj[p].color;
		   break;
		}
	}
	return val;
}


var addPhotoFeed = function (appData, mc, jsonUrl) {

	var configLegend = appData.config.legend;
   
    console.log(jsonUrl);
    jsonFlickrFeed = function (feedObject) {
        feedObject.items.map(function (entry) {
			var width = parseInt($($.parseHTML(entry.description)).find('img').attr('width')) + 25;
			var height = parseInt($($.parseHTML(entry.description)).find('img').attr('height')) + 50;
			photoDimensionsCache[entry.title] = {w:width, h:height};
			return {
                picture: entry.media.m,
                flickrLink: entry.link,
                date: entry.date_taken,
                lat: entry.latitude,
                lng: entry.longitude,
				tag: extractLegendTagFromPhotoTags(entry.tags, configLegend.tags),
				title: entry.title
            };
        }).forEach(function (photo) {
			
			if (!(photo.tag in markerCacheByTag)) {
				markerCacheByTag[photo.tag] = new Array();
			}
			
			
            var location = appData.factory.createLatLng(photo.lat, photo.lng);
			var legend = configLegend.tags;
			var color = getPropertyIgnoreCase(photo.tag, legend);
			
			var icon = {
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: color,
				fillOpacity: .8,
				scale: 6,
				strokeColor: 'white',
				strokeWeight: 0
			}
			
            var photoMarker = s11.geomodel.Place.createFromData("", icon, location);
            photoMarker.setMap(appData.map);
			markerCacheByTag[photo.tag].push(photoMarker);

            mc.addMarker(photoMarker.getMarker());
            appData.factory.addEventListener(photoMarker.getMarker(), 'mouseout', function () {
                photoFeedWindow.hide();
            });

            appData.factory.addEventListener(photoMarker.getMarker(), 'click', function () {
                window.open(photo.flickrLink);
            });
            appData.factory.addEventListener(photoMarker.getMarker(), 'mouseover', function (e) {

                photoFeedWindow.show(e.latLng, photo.picture, photo.flickrLink, photo.title, appData.map);

            });
			
			
        });
    };	

    $.ajax({
        url: jsonUrl,
        data: {format: "json"},
        dataType: "jsonp"

    });
	

    s11.pluginLoader.onLoad(photoFeed_PLUGIN_ID, true);
	
	
};

/*
 * Shows and hides the photo markers on the map when the checkbox for a specific tag is clicked.
 * Apparently the addMarker() and removeMarker() methods of MarkerClusterer take care of showing and hiding
 * the markers, so we don't have to manually call marker.setMap() 
 */
var updateMarkers = function(mc, tag, checked, map) {
	var cache = markerCacheByTag[tag];
	cache.forEach(function(marker) {
		if (checked) {
			mc.addMarker(marker.getMarker());
		} else {
			mc.removeMarker(marker.getMarker());
		}
		
	});
	return;
		
}


s11.pluginLoader.addPlugin(photoFeed_PLUGIN_ID,function(data)
{
	
 
var mc = new MarkerClusterer(map, [], {gridSize: 20, imagePath: 'js/m'});
data.config.flickrTags.split(',').forEach(function(tag) {
    var jsonUrl = "https://api.flickr.com/services/feeds/geo/?id=" + data.config.flickrId + "&lang=en-us&format=json&georss=true&tagmode=any&tags=" + tag.toLowerCase();
    addPhotoFeed(data, mc, jsonUrl);


     });

	var legend = data.config.legend.tags;
	$('#legend-window').css("background-color", data.config.legend.background);
	for (var value in legend) {
		var legendLabel = legend[value].legendLabel;
		var color = legend[value].color;
		$('#legend-window').append("<label style='color:" + color +  "'><input type='checkbox' checked='checked' id='" + value + "'>" + legendLabel + "</label><br>").show();
		$(":checkbox").change(function(e) {
			var checked = e.target.checked;
			var tag = e.target.id;
			updateMarkers(mc, tag, checked, map);
			return;
		});
	}
    
});



