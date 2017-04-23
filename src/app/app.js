import angular from 'angular';
import angularRoute from 'angular-route';

import Config from '../Config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/app.scss';

//import components
import {LoginCtrl, loginComponent} from '../login/login.js';
import {SignupCtrl, signupComponent} from '../signup/signup.js';
import {TodosCtrl, todosComponent} from '../todos/todos.js';


let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor($scope, Loading) {
    this.$scope = $scope;
    $scope.Loading = Loading;
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

const MODULE_NAME = 'app';

let appModule = angular.module(MODULE_NAME, ['ngRoute', require('angular-cookies')]);

// register controlers
appModule
    .directive('login', loginComponent)
    .controller('LoginCtrl', LoginCtrl);

appModule
    .directive('signup', signupComponent)
    .controller('SignupCtrl', SignupCtrl);

appModule
    .directive('todos', todosComponent)
    .controller('TodosCtrl', TodosCtrl);


appModule
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .config(function($routeProvider) {
    $routeProvider
      .when('/login', {
        template: require('../login/login.html'),
      })
      .when('/signup', {
        template: require('../signup/signup.html'),
      })
      .when('/todos', {
        template: require('../todos/todos.html'),
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

//Authenticate
var privateRoutes = ['/todos'];
appModule
  .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

      if(Config.debug) console.log("routeChangeStart");
        Auth.isAuthorized(function(authorized){
          if (!authorized && $location.url() != '/login' && privateRoutes.indexOf($location.path()) > -1 ) {
            $location.url('/login');
          }
          else if(authorized && $location.url() != '/todos' && privateRoutes.indexOf($location.path()) == -1){
            $location.url('/todos');
          }
        });

    });
}]);

appModule
  .factory('Auth', ['$cookies', '$http', function($cookies, $http){
    var token = $cookies.get(Config.cookies.TOKEN);

    return{
      setToken : function(t){
        token = t;
        $cookies.put(Config.cookies.TOKEN, token);
      },
      getToken: function(){
        return token;
      },
      isAuthorized: function(callback){
        callback = callback || function(){};

        if(token)
          $http({
            method: 'GET',
            url: Config.api.rootUrl + '/users',
            headers: {
              'Content-Type': 'application/json',
              'Token': token
            },
          }).then(function successCallback(response) {
            if(Config.debug) console.log("ckeck auth success");
              callback(true);
            }, function errorCallback(response) {
              if(Config.debug) console.log("ckeck auth faill");
              callback(false);
            });
        else
          callback(false);
      }
    }
  }]);

  appModule
    .factory('Loading', function(){
      return{
        busy: false
      };
    });


export default MODULE_NAME;
