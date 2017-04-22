import angular from 'angular';
import angularRoute from 'angular-route';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/app.scss';

//import components
import {LoginCtrl, loginComponent} from '../login/login.js';


let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

const MODULE_NAME = 'app';

let appModule = angular.module(MODULE_NAME, ['ngRoute']);

// import login
appModule
    .directive('login', loginComponent)
    .controller('LoginCtrl', LoginCtrl);


appModule
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .config(function($routeProvider) {
    $routeProvider
      .when('/login', {
        template: require('../login/login.html'),
      })
      .otherwise({
        redirectTo: '/login'
      });
  });


export default MODULE_NAME;
