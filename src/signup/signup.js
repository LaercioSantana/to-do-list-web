import angular from 'angular';

import Config from '../Config.js';
import '../style/signup.scss';

let signupComponent = () => {
  return {
    template: require('./signup.html'),
    controller: 'SignupCtrl',
    controllerAs: 'signup'
  }
};

var HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
}

var successLoginUrl = '/todos';

class SignupCtrl {
  constructor($scope, $cookies, $http, $location) {
    this.$scope = $scope;
    this.$cookies = $cookies;
    this.$http = $http;
    this.$location = $location;

    this.$scope.register = this.register.bind(this);

    this.$scope.createStatus = undefined;
    this.$scope.STATUS = HTTP_STATUS;
  }

  register(){
    if(!this.$scope.signupForm.$invalid){
      this.$http({
        method: 'POST',
        url: Config.api.rootUrl + '/users',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          full_name: this.$scope.name,
          email: this.$scope.email,
          password: this.$scope.password
        }
      }).then(function successCallback(response) {
        if(Config.debug) console.log("create success");
          this.$cookies.put(Config.cookies.TOKEN, response.data.token);
          this.$scope.createStatus = 200;
          this.$location.url(successLoginUrl);
        }.bind(this), function errorCallback(response) {
          if(Config.debug) console.log("create error");
          if(Config.debug) console.log(response)
          this.$scope.createStatus = response.status;
        }.bind(this));
    }
  }
}

export { SignupCtrl, signupComponent };
