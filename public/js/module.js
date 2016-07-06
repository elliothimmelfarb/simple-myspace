'use strict';

const app = angular.module('myApp', ['ui.router', 'oitozero.ngSweetAlert', 'ngCookies']);

app.constant('TOKENNAME', 'authtoken');

app.run(function(User) {
  User.readToken();
})

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/html/home.html',
    })
    .state('Register', {
      url: '/register',
      templateUrl: '/html/loginRegister.html',
      controller: 'loginRegisterCtrl'
    })
    .state('Login', {
      url: '/login',
      templateUrl: '/html/loginRegister.html',
      controller: 'loginRegisterCtrl'
    })
    .state('myProfile', {
      url: '/myProfile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl',
      resolve: {
        CurrentUser: function(User) {
          return User.getProfile();
        }
      }
    })
    .state('otherProfile', {
      url: '/viewProfile/:id',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl',
      resolve: {
        OtherUser: function(User, $stateParams) {
          return User.getUser($stateParams.id);
        }
      }
    })
  $urlRouterProvider.otherwise('/');
});
