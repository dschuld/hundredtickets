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

var photoFeedWindow = function () {

    return {
        show: function (pos, picture, flickrLink, map) {
            var point = s11.util.fromLatLngToPoint(pos, map);
			var w = map.getDiv().offsetWidth;
			var h = map.getDiv().offsetHeight;
			var alignment = {
                'left': point.x
            }
			
			//TODO alignment not hardcoded - retrieve outerHeight when thumbnail is loaded and reposition div
			//pics have to be loaded first
			//if (point.y > h/2) {
              //  alignment['top'] = point.y - 270;
			//}  else {
                alignment['top'] = point.y;
			//}
            var tt = $('#photoFeed-window');
            tt = tt.html(createThumbnailHtml(picture, flickrLink)).css(alignment);
            tt.show();
			var height = $('#photoFeed-window').height();
			return;

        },
        hide: function () {
            $('#photoFeed-window').hide();
        }
    };

}();

var createThumbnailHtml = function (picture, flickrLink) {
    var imageString = '<a href="' + flickrLink + '"  target="_blank"><img src="' + picture + '" height="auto" width="auto" /></a>';

    var contentString =
            '<div >' + imageString + '</div>';

    return contentString;
};

var extractLegendTagFromPhotoTags = function(tagString, legend) {
	var tags = tagString.split(" ");
	var tag = "";
	tags.forEach(function(curTag) {
		if(curTag in legend) {
			tag = curTag;
		}
	});
	return tag;
}


var addPhotoFeed = function (appData, mc, jsonUrl) {

   
    console.log(jsonUrl);
    jsonFlickrFeed = function (feedObject) {
        feedObject.items.map(function (entry) {
            return {
                picture: entry.media.m,
                flickrLink: entry.link,
                date: entry.date_taken,
                lat: entry.latitude,
                lng: entry.longitude,
				tag: extractLegendTagFromPhotoTags(entry.tags, appData.tripOptions.legend)
            };
        }).forEach(function (photo) {
            var location = appData.factory.createLatLng(photo.lat, photo.lng);
			var legend = appData.tripOptions.legend;
			var color = legend[photo.tag];
			
			var icon = {
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: color,
				fillOpacity: .8,
				scale: 6,
				strokeColor: 'white',
				strokeWeight: 0
			}
			
			//Pass icon drive link as second param for non-default
            var photoMarker = s11.geomodel.Place.createFromData("", icon, location);
            photoMarker.setMap(appData.map);

            mc.addMarker(photoMarker.getMarker());
            appData.factory.addEventListener(photoMarker.getMarker(), 'mouseout', function () {
                photoFeedWindow.hide();
            });

            appData.factory.addEventListener(photoMarker.getMarker(), 'click', function () {
                window.open(photo.flickrLink);
            });
            appData.factory.addEventListener(photoMarker.getMarker(), 'mouseover', function (e) {

                photoFeedWindow.show(e.latLng, photo.picture, photo.flickrLink, appData.map);

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

var createPhotoWindowContent = function (picture, flickrLink) {

    var imageString = '<a href="' + flickrLink + '"  target="_blank"><img src="' + picture + '" height="auto" width="auto" /></a>';

    var contentString = '<div id="iw-container">' +
            '<div class="iw-content">' +
            imageString +
            '</div>' +
            '</div>';

    return contentString;
};

s11.pluginLoader.addPlugin(photoFeed_PLUGIN_ID,function(data)
{
	
 
var mc = new MarkerClusterer(map, [], {gridSize: 20, imagePath: 'js/m'});
data.tripOptions.flickrTags.split(',').forEach(function(tag) {
    var jsonUrl = "https://api.flickr.com/services/feeds/geo/?id=" + data.tripOptions.flickrId + "&lang=en-us&format=json&georss=true&tagmode=any&tags=" + tag;
    addPhotoFeed(data, mc, jsonUrl);


     });

	var legend = data.tripOptions.legend;
	for (var value in legend) {
		$('#legend-window').append("<label style='color:" + legend[value] +  "'>" + value + "</label><br>").show();
	}
    
});



