import angular from 'angular';

import '../style/login.scss';

let loginComponent = () => {
  return {
    template: require('./login.html'),
    controller: 'LoginCtrl',
    controllerAs: 'login'
  }
};

class LoginCtrl {
  constructor() {
    this.signup = function(){
      console.log(this.email, this.password);
    }
  }
}

export { LoginCtrl, loginComponent };
