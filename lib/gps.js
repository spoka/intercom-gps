'use strict';

exports = module.exports = {};

exports.User = function(json) {
	var longitude = parseFloat(json.longitude);
	var latitude = parseFloat(json.latitude);

	if (!isValidLongitude(longitude)) {
		throw new Error('longitude not valid or is not within acceptable range: '  + longitude);
	}

	if (!isValidLatitude(latitude)) {
		throw new Error('latitude not valid or is not within acceptable range: ' + latitude);
	}

	this.getId = function() {
		return json.user_id;
	}

	this.getLatitude = function() {
		return latitude;
	}

	this.getLongitude = function() {
		return longitude;
	}

	this.getName = function() {
		return json.name;
	}
}

exports.Users = function(json) {

	if (!Array.isArray(json)) {
		throw new TypeError('json is not an array');
	}

	var users = json.map(function(userJson) {
		return new exports.User(userJson);
	});

	this.add = function(user) {
		if (!(user instanceof exports.User)) {
			throw new TypeError('user is not of type User');
		}

		users.push(user);
	}

	this.near = function(location, radius) {

		var nearByUsers = users.filter(function(user) {

			var R = 6371; // kilometers
			var φ1 = user.getLatitude().toRadians();
			var φ2 = location.getLatitude().toRadians();
			var λ1 = user.getLongitude().toRadians();
			var λ2 = location.getLongitude().toRadians();
			var Δφ = φ2-φ1;
			var Δλ = λ2-λ1;

			var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
			        Math.cos(φ1) * Math.cos(φ2) *
			        Math.sin(Δλ/2) * Math.sin(Δλ/2);

			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

			var d = R * c;

			return d <= radius;
		});

		return nearByUsers;
	}
}

exports.Location = function(name, lat, long) {
	var longitude = parseFloat(long);
	var latitude = parseFloat(lat);

	if (!isValidLongitude(longitude)) {
		throw new Error('longitude not valid or is not within acceptable range: '  + longitude);
	}

	if (!isValidLatitude(latitude)) {
		throw new Error('latitude not valid or is not within acceptable range: ' + latitude);
	}

	this.getLatitude = function() {
		return latitude;
	}

	this.getLongitude = function() {
		return longitude;
	}

	this.getName = function() {
		return name;
	}
}

exports.Reporter = function(locationName, distance, users) {
	if (!Array.isArray(users)) {
		throw new TypeError('json is not an array');
	}

	users.sort(function(a, b) {
		if (a.getId() < b.getId()) return -1;
		if (a.getId() > b.getId()) return 1;
		return 0;
	});

	this.report = function() {
		if (users.length) {
			console.log('Users within', distance + 'km', 'of', locationName);

			users.forEach(function(user) {
				console.log(user.getId() + ' ' + user.getName());
			})
		} else {
			console.log('There are no users within', distance + 'km', 'of', locationName);
		}
	}
}

// Extending the Number prototype. 
// Bad practice if being used by others, but okay if used just by me.
Number.prototype.toRadians = function() {
	return this * Math.PI / 180
}

// Helper functions
function isValidLatitude(latitude) {
	return typeof latitude === 'number' && latitude >= -90 && latitude <= 90;
}

function isValidLongitude(longitude) {
	return typeof longitude === 'number' && longitude >= -180 && longitude <= 180;
}