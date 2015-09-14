'use strict';

// Native libraries
var fs = require('fs'),
    readline = require('readline');

// Vendor libraries
var argv = require('minimist')(process.argv.slice(2));

// Intercom libraries
var gps = require('./lib/gps'),
	Users = gps.Users,
	User = gps.User,
	Reporter = gps.Reporter;

var pathToFile = './data/customers.txt';
var searchRadius = parseFloat(argv.radius) || 100;

var users = new Users([]);

var readFile = readline.createInterface({
    input: fs.createReadStream(pathToFile),
    output: process.stdout,
    terminal: false
});

// Read lines
readFile.on('line', function(data) {
    var user = new User(JSON.parse(data));
    users.add(user);
});

// Print results
readFile.on('close', function() {
	var Dublin = new gps.Location('Intercom.io: Dublin', 53.3381985, -6.2592576);
	var nearByUsers = users.near(Dublin, searchRadius);
	var reporter = new Reporter(Dublin.getName(), searchRadius, nearByUsers);
	
	reporter.report();
});