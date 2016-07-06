'use strict';

angular.module('myApp')

.controller('mainCtrl', function($scope, User, $state) {
  console.log('mainCtrl!');

  $scope.logout = () => {
    User.logout()
      .then(() => {
        $state.go('home');
      })
  }
})

.controller('profileCtrl', function(User, CurrentUser, $window, $scope, $state, $stateParams, $rootScope) {
  console.log('profileCtrl');
  console.log('$rootScope.currentUser:', $rootScope.currentUser)

  if ($state.current.name === 'myProfile') {
    $scope.user = CurrentUser.data;
  } else {
    $scope.user = OtherUser.data;
  }

  $scope.postMessage = (messageObj) => {
    messageObj.poster = $rootScope.currentUser._id;
    User.postMessage($scope.user._id, messageObj)
      .then(() => {
        $state.go($state.current, {}, {reload: true});
      })
  }
})

.controller('loginRegisterCtrl', function($scope, $state, User) {
  console.log('loginRegisterCtrl');
  $scope.currentState = $state.current.name;

  $scope.submit = (userObj) => {
    if($scope.currentState === 'Login') {
      //login stuff
      User.login(userObj)
        .then(user => {
          console.log('user in login:', user);
          $state.go('home');
        })
        .catch(err => {
          console.log(err);
          swal('Login failed. Error in console.');
        })
    } else {
      if(userObj.password !== userObj.password2) {
        $scope.user.password = null;
        $scope.user.password2 = null;
        swal('Passwords must match.  Try again.');
      } else {
        User.register(userObj)
          .then(res => {
            $state.go('Login');
          })
          .catch(err => {
            console.log(err);
            swal('Registration failed. Error in console.')
          });
      };
    };
  };
});
