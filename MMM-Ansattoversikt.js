Module.register('MMM-Ansattoversikt', {
	defaults: {
	},
	
	getStyles: function() {
		return ['styles.css'];
	},

	start: function() {
		this.openSlackConnection();
		this.randomEmployee = {};
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
			if(payload != null) {
				this.randomEmployee = payload;
				this.updateDom(1000);
			}
		}
	},

   getDom: function() {
		var employeeElement = document.createElement('div');
		if(this.randomEmployee.id) {
			employeeElement = this.createEmployeeElement();
		}
		return employeeElement;
	},

	createEmployeeElement: function() {
		var employeeElement = document.createElement('div');
		employeeElement.className = 'employee';
		var imageElement = document.createElement('div');
		imageElement.className = 'employee__image';
		imageElement.appendChild(this.createEmployeeImage());
		employeeElement.appendChild(imageElement);
		employeeElement.appendChild(this.createEmployeeContent());
		return employeeElement;
	},

	createEmployeeImage: function() {
		var imageElement = document.createElement('img');
		imageElement.src = this.getProfilePicture();
		return imageElement;
	},

	createEmployeeContent: function() {
		var employeeContent = document.createElement('div');
		employeeContent.className = 'employee__content';
		var nameElement = document.createElement('h2');
		nameElement.className = 'employee__content__heading employee__content__heading__name';
		nameElement.innerHTML = this.randomEmployee.name;
		var roleElement = document.createElement('div');
		roleElement.className = 'employee__content__heading employee__content__heading__role';
		roleElement.innerHTML = this.randomEmployee.role;
		var areaElement = document.createElement('div');
		areaElement.className = 'employee__content__heading employee__content__heading__area';
		areaElement.innerHTML = this.randomEmployee.productArea;
		employeeContent.appendChild(nameElement);
		employeeContent.appendChild(roleElement);
		employeeContent.appendChild(areaElement);
		return employeeContent;
	},

	getProfilePicture: function() {
		if(this.randomEmployee.imageSource === 'Slack') {
			return this.randomEmployee.some.slack.image || this.file('images/avatar_fallback.png');
		}
		return this.file('images/avatar/' + this.randomEmployee.imageSource + '.png');
	}
});
