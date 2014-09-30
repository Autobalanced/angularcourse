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
  .factory('dataService', function($firebase, FIREBASE_URL)
  {
    var dataRef = new Firebase(FIREBASE_URL);
    var fireData = $firebase(dataRef);

    return fireData;
  })
  .factory('partyService', function(dataService)
  {
    var users = dataService.$child('users');

    var partyServiceObject = 
    {
      saveParty: function(party, userId) //party and userId passed from controller
      {
        users.$child(userId).$child('parties').$add(party); //add to parties for each user
      },
      getPartiesByUserId: function(userId)
      {
        return users.$child(userId).$child('parties');
      }
    };

    return partyServiceObject;
  })
  .factory('sendEmailService', function(dataService, partyService)
  {
    var emailSent = dataService.$child('emailSent');

    var emailServiceObject =
    {
      sendEmail: function(party, userId)
      {
        var newEmail = 
        {
          email: party.email,
          size: party.size,
          name: party.name
        };
        emailSent.$add(newEmail); //add email to Firebase.emailSent queue
        partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
      }
    };

    return emailServiceObject;
  })
  .factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService)
    {
      var authRef = new Firebase(FIREBASE_URL);
      var auth = $firebaseSimpleLogin(authRef);
      var registrationEmails = dataService.$child('registrationEmails'); // Registration emails table in Firebase

      var authServiceObject = 
      {
        register: function(user) //accepts $scope.user from authController
        {
          auth.$createUser(user.email, user.password).then(function(data)
            {
              console.log(data);
              authServiceObject.login(user, function()
                {
                  registrationEmails.$add({email: user.email}); // Register new registration for sign up email event. Need to call login for security rules before registering email
                });
            });
        },
        login: function(user, optionalCallback)
        {
          auth.$login('password', user).then(function(data)
            {
              console.log(data); //Firebase docs note: returns user data if successful does not return error if not
              if (optionalCallback)
              {
                optionalCallback();
              }
              //Redirect users to the /waitlist
              $location.path('/waitlist');
            });
        },
        logout: function()
        {
          auth.$logout();
          //Redirect to "/" = "landingpage.html"
          $location.path('/');
        },
        getCurrentUser: function()
        {
          return auth.$getCurrentUser();
        }
      };

      $rootScope.$on("$firebaseSimpleLogin:error", function(e, error)
      {
        //Error catch
        console.log('firebaseSimpleLogin error: ' + error);
      });

      $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) 
      {
        $rootScope.currentUser = user;
      });

      $rootScope.$on('$firebaseSimpleLogin:logout', function()
      {
        $rootScope.currentUser = null;
      });

      return authServiceObject;
    });
