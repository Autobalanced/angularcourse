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
			phone: '',
			size: ''
		};

		// Function to save a new party to the waitlist
		$scope.saveParty = function()
		{
			$scope.parties.$add($scope.newParty);
			$scope.newParty = 
			{
				name: '',
				phone: '',
				size: ''
			};
		};

		// Function to sent a text message to a party.
		$scope.sendTextMessage = function(party)  //TODO: Change phone number *ALL* to email to test with Gmail>Zapier functions.
		{
			var textMessageRef = new Firebase('https://waitandeat-auto.firebaseio.com/textMessages');
			var textMessages = $firebase(textMessageRef);
			var newTextMessage = 
			{
				phoneNumber: party.phone,
				size: party.size,
				name: party.name
			}

			textMessages.$add(newTextMessage);
		};
	}]);