Module.register('MMM-SlackUserInfo',{
	defaults: {
	},
	
	getStyles: function() {
		return ['slack.css'];
	},

	start: function() {
		this.slackMessages = [];
		this.getUsersFromSlack();
        var self = this;
        setInterval(function() {
            self.updateDom(1000);
        }, 10000);
    },

    getUsersFromSlack: function() {

    },

    getDom: function() {

    }
});