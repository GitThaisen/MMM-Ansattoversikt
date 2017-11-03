Module.register('MMM-Ansattoversikt', {
	defaults: {
	},
	
	getStyles: function() {
		return ['slack.css'];
	},

	start: function() {
		this.openSlackConnection();
        var self = this;
        setInterval(function() {
            self.updateDom(1000);
        }, 10000);
    },

    openSlackConnection: function() {
		this.sendSocketNotification('GET_SLACK_USERINFO', {config: this.config});
    },
    
    socketNotificationReceived: function(notification, payload) {
		if(notification === 'SLACK_RANDOM_USER'){
			if(payload != null) {
				this.randomUser = payload;
				this.updateDom(2.5 * 1000);
			}
		}
	},

    getDom: function() {
      var userElement = document.createElement('div');
		userElement.className = 'light normal';
		if(this.randomUser)
		{
			var image = document.createElement('img');
			image.className = 'profilePicture';
         image.src = this.randomUser.some.slack.image;
         userElement.appendChild(image);
         var userName = document.createElement('p');
         userName.innerHTML = this.randomUser.name + '<br/>' + this.randomUser.role;
         userElement.appendChild(userName);
		}
		return userElement;
    }
});