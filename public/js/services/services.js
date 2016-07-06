'use strict';

angular.module('myApp')

.service('User', function($http, $rootScope, $q, $cookies, TOKENNAME){

  this.readToken = () => {
    let token = $cookies.get(TOKENNAME);
    if(typeof token === 'string') {
      let payload = JSON.parse(atob(token.split('.')[1]));
      $rootScope.currentUser = payload;
    };
  };

  this.postMessage = (id, messageObj) => {
    return $http.post(`/api/users/${id}/postMsg`, messageObj)
  }

  this.getUser = (id) => {
    return $http.get(`/api/users/${id}`);
  };

  this.getProfile = () => {
    return $http.get('/api/users/profile');
  };

  this.register = (userObj) => {
    return $http.post('/api/users/register', userObj);
  }

  this.login = (userObj) => {
    return $http.post('/api/users/login', userObj)
      .then(res => {
        $rootScope.currentUser = res.data;
        return $q.resolve(res.data);
      })
  }

  this.logout = () => {
    $cookies.remove(TOKENNAME);
    $rootScope.currentUser = null;
    return $q.resolve();
  }
});
