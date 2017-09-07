var NodeHelper = require('node_helper');
var WebClient = require('@slack/client').WebClient;
var slackUsers = [];

module.exports = NodeHelper.create({
    
    start: function() {
        console.log('Starting node helper for: ' + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
		var self = this;
        if(notification === 'GET_SLACK_USERINFO') {
            self.config = payload.config;
            this.getUsersFromSlack();
        }
	},
    
    getUsersFromSlack: function() {
        var self = this;
        console.log(slackUsers.length);
        if(slackUsers.length == 0) {
            var token = self.config.slackToken;
            var userListUrl = 'https://slack.com/api/users.list';
            var slackWebClient = new WebClient(token);
            slackWebClient.users.list({limit: 0}, function user(err, response) {
                slackUsers = response.members;
                self.getRandomUser();
            });
        }
        else
            self.getRandomUser();
    },

    getRandomUser: function() {
        var self = this;
        var randomUser = slackUsers[Math.floor(Math.random() * slackUsers.length)];
        //console.log(randomUser);
        self.sendSocketNotification('SLACK_RANDOM_USER', randomUser);
        setTimeout(function() { self.getUsersFromSlack(); }, self.config.updateInterval * 1000);
    }
});