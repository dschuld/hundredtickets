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

var s11 = s11 || {};
s11.ui = s11.ui || {};


var factory = s11.geomodel.getFactory();

var configureInfowindow = function (infoWindow) {

    // Copied from http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
    /*
     * The google.maps.event.addListener() event waits for
     * the creation of the infowindow HTML structure 'domready'
     * and before the opening of the infowindow defined styles
     * are applied.
     */
    factory.addEventListener(infoWindow, 'domready', function () {

//TODO probably better to do it without infowindow
//http://stackoverflow.com/questions/19497727/how-do-i-create-a-tooltip-with-overflow-visible-in-google-maps-v3
        var container = $('#iw-container');

        var iwOuter = container.parent().parent().parent();
        var iwOuterChild = container.parent().parent();
        iwOuterChild.css({overflow: 'hidden'});

        iwOuter.attr("class", "gm-style-iw");

        // Reference to the DIV which receives the contents of the infowindow using jQuery
//        var iwOuter = $('.gm-style-iw');

        // Moves the infowindow 115px to the right.
//        iwOuter.parent().css({top: '-150px',left: '115px'});

        removeBackgroundAndTail(iwOuter);

        // Changes the desired color for the tail outline.
        // The outline of the tail is composed of two descendants of div which contains the tail.
        // The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
//        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1'});


        // Taking advantage of the already established reference to
        // div .gm-style-iw with iwOuter variable.
        // You must set a new variable iwCloseBtn.
        // Using the .next() method of JQuery you reference the following div to .gm-style-iw.
        // Is this div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();

        // Apply the desired effect to the close button
        iwCloseBtn.css({
            width: '27px',
            height: '27px',
            display: 'inline',
            opacity: '1', // by default the close button has an opacity of 0.7
            right: '38px', top: '3px', // button repositioning
            border: '7px solid #48b5e9', // increasing button border and new color
            'border-radius': '13px', // circular effect
            'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
        });

        // The API automatically applies 0.7 opacity to the button after the mouseout event.
        // This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function () {
            $(this).css({opacity: '1'});
        });

    });
};


var removeBackgroundAndTail = function (outerDiv) {
    var iwBackground = outerDiv.prev();

    // Remove the background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display': 'none'});

    // Remove the white background DIV
    iwBackground.children(':nth-child(4)').css({'display': 'none'});

    iwBackground.children(':nth-child(1)').css({'display': 'none'});
    iwBackground.children(':nth-child(3)').css({'display': 'none'});
};



var createInfoWindowContentString = function (heading, contentString) {

    return '<div id="iw-container">' +
            '<div class="iw-title">' + heading + '</div>' +
            '<div class="iw-content">' +
            contentString + '<p>' +
            '</div>' +
            '</div>';

};


s11.ui.getContentProvider = function (contentJson, name, wpApi) {
    if (!contentJson) {
        return s11.ui.NullContentProvider.create();
    }
    ;


    var contentJson = JSON.parse(contentJson);

    if (contentJson.blog) {
        return s11.ui.BlogExcerptContentProvider.create(wpApi, name, contentJson.blog);
    } else if (contentJson.image) {
        return s11.ui.ImageContentProvider.create(name, contentJson);
    } else if (contentJson.youtube) {
        return s11.ui.YoutubeContentProvider.create(name, contentJson.youtube);
    } else if (contentJson.text) {
        return s11.ui.TextContentProvider.create(name, contentJson.text);
    }
};

/**
 * A ContentProvider that does not show anything. No info window is shown when the component is clicked.
 */
s11.ui.NullContentProvider = function () {

    return {
        create: function () {
            return {
                getContent: function (callback) {
                    return;
                }
            };
        }
    };

}();                                                                                                                            

/**
 * A ContentProvider that shows some text in the info window.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
 */
s11.ui.TextContentProvider = function () {

    return {
        create: function (name, text) {
            return {
                getContent: function (callback) {
                    var contentString = createInfoWindowContentString(name, text);
                    callback(contentString);
                }
            };
        }
    };

}();

/**
 * A ContentProvider that shows an embedded Youtube video player. 
 */
s11.ui.YoutubeContentProvider = function () {
    
    return {
        create: function (name, link) {
            return {
                getContent: function (callback) {
                    var contentString = '<iframe id="ytplayer" type="text/html" height="300" width="480"  src="https://www.youtube.com/embed/' + link + '" frameborder="0"/>';
                    contentString = createInfoWindowContentString(name, contentString);
                    callback(contentString);
                }
            };
        }
    };

}();

/**
 * A ContentProvider that shows an image in the info window. The image URL is passed into the provider.
 */
s11.ui.ImageContentProvider = function () {

    var makeSourceLink = function (source) {
        if (source) {
            return '<a href="' + source + '">Photo</a>';
        } else {
            return '';
        }
    };

    var makeLicenseLink = function (licenseUrl, licenseName) {

        if (!licenseName) {
            return '';
        }

        var licenseString = " / ";
        if (licenseUrl) {
            licenseString += '<a href="' + licenseUrl + '">';
        }

        return licenseString + licenseName + '</a>';
    };

    var makeAttribution = function (contentJson) {

        if (!contentJson.author) {
            return '';
        }
        return  makeSourceLink(contentJson.source) + ' by ' + contentJson.author + ' ' + makeLicenseLink(contentJson.licenseUrl, contentJson.license);
    };

    return {
        create: function (name, contentJson) {
            return {
                getContent: function (callback) {
                    if (!contentJson.image) {
                        return;
                    }
                    var imageTag = '<img src="' + contentJson.image + '" height="auto" width="auto" />' + makeAttribution(contentJson);

                    var contentString = createInfoWindowContentString(name, imageTag);
                    callback(contentString);

                }
            };
        }
    };

}();


/**
 * A ContentProvider that shows an a post excerpt of a Wordpress post. I receives the slug identifiying the post, and 
 * an object encapsulating the Wordpress REST API access. The excerpt is shown in the info window, typically 
 * containing a "Read more..." link.
 */
s11.ui.BlogExcerptContentProvider = function () {


    return {
        create: function (wpApi, name, slug) {

            var cachedExcerpt;
            var getPost = function (slug, callback) {

                if (!cachedExcerpt) {
                    wpApi.getPost(slug, function (excerpt) {
                        cachedExcerpt = excerpt;
                        callback(excerpt);
                    });

                } else {
                    callback(cachedExcerpt);
                }
            };

            return {
                getContent: function (callback) {
                    if (!name) {
                        return;
                    }

                    getPost(slug, function (excerpt) {
                        var contentString = createInfoWindowContentString(name, excerpt);
                        callback(contentString);
                    });

                }
            };
        }
    };

}();

s11.ui.InfoWindow = function () {

    var infoWindow = factory.createInfoWindow();


    configureInfowindow(infoWindow);

    return {
        showFromEvent: function (e, map) {
            var x = e.pageX;
            var pos = factory.createLatLng(e.pageX, e.pageY);

            var point = s11.util.fromLatLngToPoint(pos, map);
            this.show({'latLng': point});

        },
        show: function (e) {

            if (this.infoWindowContentProvider) {
                this.infoWindowContentProvider.getContent(function (content) {

                    if (content) {
                        infoWindow.setContent(content);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.open(this.map);
                    }
                });

            }

        }
    };
}();


