'use strict';

const app = angular.module('myApp', ['ui.router', 'oitozero.ngSweetAlert', 'ngCookies']);

app.run(function() {
  
})

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/html/home.html',
    })
  $urlRouterProvider.otherwise('/');
});
