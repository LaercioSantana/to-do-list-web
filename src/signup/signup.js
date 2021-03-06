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
  constructor($scope, $cookies, $http, $location, Loading, Auth) {
    this.$scope = $scope;
    this.$cookies = $cookies;
    this.$http = $http;
    this.$location = $location;
    this.Auth = Auth;
    this.$scope.Loading = Loading;

    this.$scope.register = this.register.bind(this);

    this.$scope.createStatus = undefined;
    this.$scope.STATUS = HTTP_STATUS;
  }

  register(){
    var end = function(response){
      this.$scope.createStatus = response.status;
      this.$scope.Loading.busy = false;
    }.bind(this);

    if(!this.$scope.signupForm.$invalid){
      this.$scope.Loading.busy = true;
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
          this.Auth.setToken(response.data.token);
          this.$location.url(successLoginUrl);
          end(response);
        }.bind(this), function errorCallback(response) {
          if(Config.debug) console.log("create error");
          if(Config.debug) console.log(response)
          end(response);
        }.bind(this));
    }
  }
}

export { SignupCtrl, signupComponent };
