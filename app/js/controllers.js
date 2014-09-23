'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function()
	{
		
	}])
	.controller('WaitListController', ['$scope', '$firebase', function($scope, $firebase)
	{
		// Connection $scope.parties to live Firebase data(parties).
		var partiesRef = new Firebase('https://waitandeat-auto.firebaseio.com/parties')

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
			var emailsRef = new Firebase('https://waitandeat-auto.firebaseio.com/emailSent'); //new Firebase object
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
	.controller('AuthController', ['$scope', '$firebaseSimpleLogin', function($scope, $firebaseSimpleLogin)
	{
		var authRef = new Firebase('https://waitandeat-auto.firebaseio.com/');
		var auth = $firebaseSimpleLogin(authRef);

		$scope.user = 
		{
			email: '',
			password: ''
		};

		$scope.register = function()
		{
			auth.$createUser($scope.user.email, $scope.user.password).then(function(data)
				{
					console.log(data);
				});
		};
	}]);