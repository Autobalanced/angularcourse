'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function()
	{
		
	}])
	.controller('WaitListController', ['$scope', '$firebase', 'FIREBASE_URL', function($scope, $firebase, FIREBASE_URL)
	{
		// Connection $scope.parties to live Firebase data(parties).
		var partiesRef = new Firebase(FIREBASE_URL + 'parties')

		$scope.parties = $firebase(partiesRef);

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
			$scope.parties.$add($scope.newParty);
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
			var emailsRef = new Firebase(FIREBASE_URL + 'emailSent'); //new Firebase object
			var emailSent = $firebase(emailsRef); //local object = Firebase object
			var newEmail = 
			{
				email: party.email,
				size: party.size,
				name: party.name
			}

			emailSent.$add(newEmail); //add email to Firebase.emailSent queue
			party.notified = 'Yes';
			$scope.parties.$save(party.$id); //save changes to Firebase
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