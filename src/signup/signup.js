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
  constructor() {
    this.register = function(){
      console.log(this.name, this.email, this.password);
    }
  }
}

export { SignupCtrl, signupComponent };
