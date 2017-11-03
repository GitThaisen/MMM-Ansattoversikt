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
		this.sendSocketNotification('GET_RANDOM_EMPLOYEE', {config: this.config});
   },
    
   socketNotificationReceived: function(notification, payload) {
		if(notification === 'RANDOM_EMPLOYEE') {
			console.log(payload);
			if(payload != null) {
				this.randomEmployee = payload;
				this.updateDom(2.5 * 1000);
			}
		}
	},

   getDom: function() {
      var employeeElement = document.createElement('div');
		employeeElement.className = 'light normal';
		if(this.randomEmployee) {
			var image = document.createElement('img');
			image.className = 'profilePicture';
         image.src = this.getProfilePicture();
         employeeElement.appendChild(image);
         var employeeName = document.createElement('p');
         employeeName.innerHTML = this.randomEmployee.name + '<br/>' + this.randomEmployee.role;
         employeeElement.appendChild(employeeName);
		}
		return employeeElement;
	},

	getProfilePicture: function(result) {
		if(this.randomEmployee.imageSource === 'Slack') {
			return this.randomEmployee.some.slack.image != '' ? this.randomEmployee.some.slack.image : './images/avatar_fallback.png';
		}
		return './images/avatar/' + this.randomEmployee.imageSource + '.png';
	}
});