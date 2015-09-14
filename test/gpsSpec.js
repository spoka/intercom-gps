'use strict';

var expect = require('chai').expect;
var gps = require('../lib/gps.js');

var badLatitudes = ['100', 100, 'bad', [], {}, /regex/, null, NaN, void 0];
var goodLatitudes = ['-90', '90', -90, 0, 90];

var badLongitudes = ['200', 200, 'bad', [], {}, /regex/, null, NaN, void 0];
var goodLongitudes = ['-180', '180', -180, 0, 180];

describe('User', function() {
	var user;

	before(function() {
		var json = {'latitude': '52.986375', 'user_id': 12, 'name': 'Christina McArdle', 'longitude': '-6.043701'};
		user = new gps.User(json);
	});

	it('should only accept a valid latitude', function() {
			
			badLatitudes.forEach(function(badLatitude) {
				var badJson = {'latitude': badLatitude, 'user_id': 12, 'name': 'Christina McArdle', 'longitude': '-6.043701'};
				var badUser = gps.User.bind(gps.User, badJson);
				expect(badUser).to.throw(Error);
			})
			
			goodLatitudes.forEach(function(goodLatitude) {
				var goodJson = {'latitude': goodLatitude, 'user_id': 12, 'name': 'Christina McArdle', 'longitude': '-6.043701'};
				var goodUser = gps.User.bind(gps.User, goodJson);
				expect(goodUser).to.not.throw(Error);		
			});
	});

	it('should only accept a valid longitude', function() {

			badLongitudes.forEach(function(badLongitude) {
				var badJson = {'longitude': badLongitude, 'user_id': 12, 'name': 'Christina McArdle', 'latitude': '-6.043701'};
				var badUser = gps.User.bind(gps.User, badJson);
				expect(badUser).to.throw(Error);
			})
			
			goodLongitudes.forEach(function(goodLongitude) {
				var goodJson = {'longitude': goodLongitude, 'user_id': 12, 'name': 'Christina McArdle', 'latitude': '-6.043701'};
				var goodUser = gps.User.bind(gps.User, goodJson);
				expect(goodUser).to.not.throw(Error);		
			});
	});

	describe('#getId()', function() {
		it('should return an id', function() {
			expect(user.getId()).to.be.a('number');
			expect(user.getId()).to.equal(12);
		});
	});

	describe('#getLatitude()', function() {
		it('should return a latitude', function() {
			expect(user.getLatitude()).to.be.a('number');
			expect(user.getLatitude()).to.equal(52.986375);
		});	
	})
	
	describe('#getLongitude()', function() {
		it('should return a longitude', function() {
			expect(user.getLongitude()).to.be.a('number');
			expect(user.getLongitude()).to.equal(-6.043701);
		});
	});
	
	describe('#getName()', function() {
		it('should return a name', function() {
			expect(user.getName()).to.be.a('string');
			expect(user.getName()).to.equal('Christina McArdle');
		})	
	});
});

describe('Location', function() {
	var location;

	before(function() {
		location = new gps.Location('Intercom Dublin', 53.3381985, -6.2592576);
	});

	it('should only accept a valid latitude', function() {
			
			badLatitudes.forEach(function(badLatitude) {
				var badLocation = gps.Location.bind(gps.Location, 'Bad location', badLatitude, 0);
				expect(badLocation).to.throw(Error);
			})
			
			goodLatitudes.forEach(function(goodLatitude) {
				var goodLocation = gps.Location.bind(gps.Location, 'Good location', goodLatitude, 0);
				expect(goodLocation).to.not.throw(Error);		
			});
	});

	it('should only accept a valid longitude', function() {

			badLongitudes.forEach(function(badLongitude) {
				var badLocation = gps.Location.bind(gps.Location,'Bad location', 0, badLongitude);
				expect(badLocation).to.throw(Error);
			})
			
			goodLongitudes.forEach(function(goodLongitude) {
				var goodLocation = gps.Location.bind(gps.Location, 'Good location', 0, goodLongitude);
				expect(goodLocation).to.not.throw(Error);		
			});
	});

	describe('#getLatitude()', function() {
		it('should return a latitude', function() {
			expect(location.getLatitude()).to.be.a('number');
			expect(location.getLatitude()).to.equal(53.3381985);
		});
	});

	describe('#getLongitude()', function() {
		it('should return a longitude', function() {
			expect(location.getLongitude()).to.be.a('number');
			expect(location.getLongitude()).to.equal(-6.2592576);
		});
	});

	describe('#getName()', function() {
		it('should return a name', function() {
			expect(location.getName()).to.equal('Intercom Dublin');
		})
	})
})

describe('Users', function() {
	describe('#add()', function() {
		it('should only add users of type User', function() {
			var users = new gps.Users([]);
			
			var badUsers = [1, 'bad', [], {}, /regex/, null, NaN, void 0, new Number(), new Array(), new Boolean(), new String(), new gps.Users([])];
			badUsers.forEach(function(badUser) {
				var badUserAdd = users.add.bind(gps.Users, badUser);
				expect(badUserAdd).to.throw(TypeError);
			})

			var goodUser = new gps.User({'latitude': '53.3381985', 'user_id': 12, 'name': 'Intercom mascot', 'longitude': '-6.2592576'});
			var goodUserAdd = users.add.bind(gps.Users, goodUser);
			expect(goodUserAdd).to.not.throw(Error);
		});
	});

	describe('#near()', function() {
		var usersJson = [
			{'latitude': '53.3381985', 'user_id': 12, 'name': 'Intercom mascot', 'longitude': '-6.2592576'},
			{'latitude': '51.92893', 'user_id': 1, 'name': 'Alice Cahill', 'longitude': '-10.27699'}
		];

		var users = new gps.Users(usersJson);
		var Dublin = new gps.Location('Dublin', 53.3381985, -6.2592576);

		it('should return a list of nearby users', function() {
			var radius = 100; //km
			expect(users.near(Dublin, radius).length).to.equal(1);
		});

		it('should not return a list of far away users', function() {
			var radius = 100; //km
			var GulfOfGuinea = new gps.Location('Gulf of Guinea', 0, 0);
			expect(users.near(GulfOfGuinea, radius).length).to.equal(0);
		});

		it('should only accept an array as a parameter', function() {
			var badParams = [1, 'string', {}, null, /regex/, NaN, true, void 0];
			badParams.forEach(function(param) {
				var badUser = gps.Users.bind(gps.Users, param);
				expect(badUser).to.throw(TypeError);
			});

			var goodUser = gps.Users.bind(gps.Users, []);
			expect(goodUser).to.not.throw(Error);
		});
	});
})

describe('Reporter', function() {
	it('should only accept an array as a parameter', function() {
		var badParams = [1, 'string', {}, null, /regex/, NaN, true, void 0];
		badParams.forEach(function(param) {
			var badReporter = gps.Reporter.bind(gps.Reporter, "Bad Location", 0, param);
			expect(badReporter).to.throw(TypeError);
		});

		var goodReporter = gps.Reporter.bind(gps.Reporter, "Good location", 0, []);
		expect(goodReporter).to.not.throw(Error);
	});
})