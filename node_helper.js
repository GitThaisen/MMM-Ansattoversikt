var NodeHelper = require('node_helper');
var WebClient = require('@slack/client').WebClient;
var GoogleSpreadsheet = require('google-spreadsheet');

var slackAllUsers = [];
var employees = [];
var creds = require('./client_secret.json');

module.exports = NodeHelper.create({
	start: function() {
		console.log('Starting node helper for: ' + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if(notification === 'GET_SLACK_USERINFO') {
			self.config = payload.config;
			self.getDataFromSpreadSheet(function(nrkEmployees) {
				self.getUsersFromSlack(function(slackUsers) {
					var slackInfo = slackUsers.map((user) => {
						var image = user.profile.image_original && (user.profile.image_192 || '');
						return {
							username: user.name || '',
							presence: user.presence || '',
							image,
							bio: user.profile && (user.profile.title || '')
						};
					});
					employees = self.populateWithSlackData(nrkEmployees, slackInfo);
					self.getRandomUser();
				});
			});
		}
	},

	formatValues: function(columnHeaders, valuesArr) {
		var obj = {};
		for (var key in valuesArr) {
		  obj[columnHeaders[key]] = valuesArr[key];
		}
		return obj;
	},
	 
	isEmployed: function(person) {
		const employeeNumber = person['Ans.nr'] ? person['Ans.nr'].trim() : null;
		if (!employeeNumber) {
			return false;
		}
		return /\d{4,6}/.test(Number(employeeNumber));
	},

	createBeautifulPersonObject: function(person) {
		self = this;
		return {
		  	id: person.UUID || '',
		  	name: person.Ansattnavn || '',
		  	exposeLevel: person['Ekspo.'],
		  	role: person['Primærrolle'] || '',
		  	productArea: person['Produktområde'] || '',
		  	// kaleidoId: person['Bilde-id (Kaleido)'] || '',
		  	imageSource: person.Profilbilde,
		  	bio: person['Kort biografi'] || '',
		  	mail: person['E-postadresse'] || '',
		  	some: {
			 	slack: person.Slack || ''
		  	}
		};
	},

	populateWithSlackData: function(googleData, slackData) {
		return googleData.map((employee) => {
			const slacker = slackData.filter((s) => {
				return s.username === employee.some.slack;
		  	}).pop();
		  	employee.some.slack = slacker || {};
		  	return employee;
		});
	 },

	getDataFromSpreadSheet: function(result) {
		var self = this;
		if(employees.length === 0) {
			var doc = new GoogleSpreadsheet(self.config.googleSpreadSheetId);
			doc.useServiceAccountAuth(creds, function (err) {
				doc.getRows(1, { offset: 2, limit: 20 }, function(err, rows) {
					var columnHeaders = rows[0];
					var employeesFromSpreadsheet = rows.slice(1)
						.map((valuesArray) => self.formatValues(columnHeaders, valuesArray))
						.filter(self.isEmployed)
						.map(self.createBeautifulPersonObject);
					employees = employeesFromSpreadsheet;
					result(employees);
				});
			});
		}
		else
		result(employees);
	},

	getUsersFromSlack: function(result) {
		var self = this;
		if(slackAllUsers.length === 0) {
			var token = self.config.slackToken;
			var slackWebClient = new WebClient(token);

			slackWebClient.users.list({limit: 0}, function user(err, response) {
				slackAllUsers = response.members;
				result(slackAllUsers);
			});
		}
		else
			result(slackAllUsers);
	},

	getRandomUser: function() {
		var self = this;
		var randomUser = employees[Math.floor(Math.random() * employees.length)];
		self.sendSocketNotification('SLACK_RANDOM_USER', randomUser);
		setTimeout(function() { self.getRandomUser(); }, self.config.updateInterval * 1000);
	}
});