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
  constructor($scope, $cookies, $http, $location, Loading, Auth) {
    this.$scope = $scope;
    this.$http = $http;
    this.$location = $location;
    this.Auth = Auth;

    $scope.successLogin = undefined;
    this.$scope.Loading = Loading;
  }

  login(){

    var end = function(response){
      this.$scope.Loading.busy = false;
    }.bind(this);

    this.$scope.Loading.busy = true;
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
        this.Auth.setToken(response.data.token);
        this.$location.url(successLoginUrl);
        this.$scope.successLogin = true;
        end(response);
        if(Config.debug) console.log("login success");
      }.bind(this), function errorCallback(response) {
        if(Config.debug) console.log("login error");
        this.$scope.successLogin = false;
        end(response);
      }.bind(this));

    if(Config.debug) console.log(this.email, this.password);
  }
}

export { LoginCtrl, loginComponent };
