import angular from 'angular';

import '../style/signup.scss';

let signupComponent = () => {
  return {
    template: require('./signup.html'),
    controller: 'SignupCtrl',
    controllerAs: 'signup'
  }
};

class SignupCtrl {
  constructor($scope, $cookies, $http, $location) {
    this.$scope = $scope;
    this.$cookies = $cookies;
    this.$http = $http;
    this.$location = $location;


  }
}

export { SignupCtrl, signupComponent };
