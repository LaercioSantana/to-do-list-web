import angular from 'angular';

import Config from '../Config.js';
import '../style/login.scss';

let loginComponent = () => {
  return {
    template: require('./login.html'),
    controller: 'LoginCtrl',
    controllerAs: 'login'
  }
};

var successLoginUrl = '/todos';

class LoginCtrl {
  constructor($scope, $cookies, $http, $location) {
    this.$scope = $scope;
    this.$cookies = $cookies;
    this.$http = $http;
    this.$location = $location;

    $scope.successLogin = undefined;
  }

  login(){
    this.$http({
      method: 'POST',
      url: Config.api.rootUrl + '/users/tokens/get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: this.email,
        password: this.password
      }
    }).then(function successCallback(response) {
        this.$cookies.put(Config.cookies.TOKEN, response.data.token);
        this.$location.url(successLoginUrl);
        this.$scope.successLogin = true;
        if(Config.debug) console.log("login success");
      }.bind(this), function errorCallback(response) {
        this.$scope.successLogin = false;
        if(Config.debug) console.log("login error");
      }.bind(this));

    if(Config.debug) console.log(this.email, this.password);
  }
}

export { LoginCtrl, loginComponent };
