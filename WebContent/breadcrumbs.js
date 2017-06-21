/**
 * 
 * GeoLocation Subroutines
 */
var trafficLevel;

function findMeNow(traffic) {
	if (navigator.geolocation) {
		var timeoutVal = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(logPosition, logError, {
			enableHighAccuracy : true,
			timeout : timeoutVal,
			maximumAge : 0
		});
		trafficLevel = traffic;
	} else {
		write("message", "<b>Geolocation is not supported by this browser</b>");
	}
}

function logPosition(position) {
	var contentString = "<table>"
			+ "<tr><td>Timestamp</td><td>"
			+ parseTimestamp(position.timestamp)
			+ "</td></tr><tr><td>Latitude</td><td>"
			+ position.coords.latitude
			+ "</td></tr><tr><td>Longitude</td><td>"
			+ position.coords.longitude
			+ "</td></tr><tr><td>Accuracy</td><td>"
			+ position.coords.accuracy
			+ "</td></tr><tr><td>Traffic</td><td>"
			+ trafficLevel
			+ "</td></tr></table>";

	write("message", contentString);
	findAddress(position);
}


function logError(error) {
	var errors = {
		1 : 'Permission denied',
		2 : 'Position unavailable',
		3 : 'Request timeout'
	};

	write("message", "<b>Error</b>:" + errors[error.code]);

}

function parseTimestamp(timestamp) {
	var d = new Date(timestamp);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var hour = d.getHours();
	var mins = d.getMinutes();
	var secs = d.getSeconds();
	var msec = d.getMilliseconds();
	var dDate = year * 10000 + month * 100 + day; 
	var tTime = hour * 10000 + mins * 100 + secs + msec / 100; 
	return dDate + " " + tTime;
}

function findAddress(position) {
	var geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(position.coords.latitude,
			position.coords.longitude);
	geocoder.geocode({
		'latLng' : latlng
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				write('location', "You are near " + results[1].formatted_address);
			} else {
				write('location', 'No results found');
			}
		} else {
			write('location', 'Geocoder failed due to: ' + status);
		}
	});
}

function write(fieldName, fieldContents)
{
	document.getElementById(fieldName).innerHTML = fieldContents; 
}
