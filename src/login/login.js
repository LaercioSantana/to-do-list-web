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
  constructor($cookies, $http, $location) {
    this.$cookies = $cookies;
    this.$http = $http;
    this.$location = $location;
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
        if(Config.debug) console.log("login success");
      }.bind(this), function errorCallback(response) {
        this.onUnauthorizedLogin();
        if(Config.debug) console.log("login error");
      }.bind(this));

    if(Config.debug) console.log(this.email, this.password);
  }

  onUnauthorizedLogin(){
    if(Config.debug) console.log('Usuario invalido');
  }

}

export { LoginCtrl, loginComponent };
