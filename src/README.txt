DIEM Community Maps

*******************

The application automatically loads photos from a Flickr account and shows them on a Google Map. At the location the photo was taken, a coloured dot is displayed which shows a thumbnail (small version of the photo) when hovering the mouse over the dot. A click on the dot then opens the photo on the Flickr website.

Uploading photos
****************
Photos can be uploaded by using the Flickr website, or the Flickr app for Android / IPhone. 
Using the Flickr website:
- Make sure you are logged in with the DIEM project account (info@diem-project.org)
- Click the "Upload" icon (cloud-shaped icon in the top right corner)
- Click "Choose photos and videos to upload" and select the photo from your PC, or drag and drop a photo into the page
- In the following dialog, specify title and description. The title will be displayed below the photo in the thumbnail on the map. Make sure that the title is not too long, otherwise it might cause problems to the thumbnail layout.
- Specify the photo tag. The photo must have exactly one tag of the list of available tags. If no tag is given, the photo will not be shown on the map. If more than one tag is given, one of them will be picked randomly.
- Click the upload button in the top right corner.
- After the photo has been uploaded, do a quick check of the photo:
	- Is it geotagged and shown on the right location? In the info area below the photo there must be a small map that shows the location. A click on this map opens a larger map where you can reposition the photo if the location is not correct. If you see "Add this photo to your map", the photo is not geotagged. In this case you need to find out the location the photo was taken, click the "Add photo to your map" link and position the photo manually.
	- Is it tagged properly with an existing DIEM tag? If not, click "Add Tag" and specify a tag. Don't forget to press Enter.
	- Is the viewing privacy set to public? Otherwise it will not appear on the Community Map. This setting is the default when uploading a photo.
	- If these 3 points are OK, the photo should appear after reloading the DIEM Community Maps page.
	
	
	
	
Introduce a new tag
*******************
If a new photo category should be introduced, the tag needs to be specified in the config.json file. There are 2 JSON properties that need to include the tag. Tags must be one word (no blanks, otherwise it will be regarded as several distinct tags) and must exactly match the tag that will be assigned to the photos on flickr regarding spelling and upper/lowercase.
- a comma-separated list in "flickrTags", which loads all pictures containing this tag from the Flickr account. If the tag is not specified here, the picture will not be shown.
- A tag to color mapping in "legend", which specifies the color of the dots. If the tag is not specified here, the dot will be black.
- When these changes have been made, photos in flickr can be tagged and the photos with the new tag should appear on the DIEM community maps.
	