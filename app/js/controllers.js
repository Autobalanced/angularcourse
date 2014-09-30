'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function()
	{
		
	}])
	.controller('WaitListController', ['$scope', 'partyService', 'sendEmailService', 'authService', function($scope, partyService, sendEmailService, authService)
	{
		// Bind users parties to $scope.parties
		authService.getCurrentUser().then(function(user)
		{
			if (user)
			{
				$scope.parties = partyService.getPartiesByUserId(user.id);
			};
		})

		// Object to store data from the waitlist.html form.
		$scope.newParty = 
		{
			name: '',
			email: '',
			size: '',
			done: false,
			notified: 'No'
		};

		// Function to save a new party to the waitlist
		$scope.saveParty = function()
		{
			partyService.saveParty($scope.newParty, $scope.currentUser.id);
			$scope.newParty = 
			{
				name: '',
				email: '',
				size: '',
				done: false,
				notified: 'No'
			};
		};

		// Function to sent a text message to a party.
		$scope.sendEmail = function(party)
		{
			sendEmailService.sendEmail(party, $scope.currentUser.id);
		};
	}])
	.controller('AuthController', ['$scope', 'authService', function($scope, authService)
	{

		//Object bound to user input on register and login page
		$scope.user = 
		{
			email: '',
			password: ''
		};

		//Method to register new user using the authService
		$scope.register = function()
		{
			authService.register($scope.user);
		};

		//Method to login existing user using the authService
		$scope.login = function()
		{
			authService.login($scope.user);
		};

		//Method to logout existing user using the authService
		$scope.logout = function()
		{
			authService.logout();
		};
	}]);