'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  // .value('FIREBASE_URL', 'https://waitandeat-auto.firebaseio.com/') <-- only to be used for REALLY simple apps, if at all.
  .factory('FIREBASE_URL', function()
  {
  	return 'https://waitandeat-auto.firebaseio.com/'; //.factory > .value so you can return multiple values through functions.
  })
  .factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL)
  	{
  		var authRef = new Firebase(FIREBASE_URL);
  		var auth = $firebaseSimpleLogin(authRef);

  		var authServiceObject = 
  		{
  			register: function(user) //accepts $scope.user from authController
  			{
  				auth.$createUser(user.email, user.password).then(function(data)
  					{
  						console.log(data);
  						authServiceObject.login(user); 
  					});
  			},
  			login: function(user) //accepts $scope.user from authController
  			{
  				auth.$login('password', user).then(function(data)
  					{
  						console.log(data); //Firebase docs note: returns user data if successful does not return error if not
  						//Redirect users to the /waitlist
  						$location.path('/waitlist');
  					});
  			},
  			logout: function()
  			{
  				auth.$logout();
  				console.log('authService Logout called');
  				//Redirect to "/" = "landingpage.html"
  				$location.path('/');
  			}
  		};

  		$rootScope.$on("firebaseSimpleLogin:error", function(e, error)
  		{
  			//Error catch
  			console.log('Firebase error: ' + error);
  		});

  		$rootScope.$on("firebaseSimpleLogin:login", function(e, user)
  		{
  			$rootScope.currentUser = user; //rootScope is global scope
  			console.log("Firebase login even: User " + user.id + " successfully logged in!");
  		});

  		$rootScope.$on("firebaseSimpleLogin:logout", function()
  		{
  			$rootScope.currentUser = null;
  			console.log('firebase logout fired');
  		});

  		return authServiceObject;
  	});
