import angular from 'angular';

import Config from '../Config.js';
import '../style/todos.scss';

let todosComponent = () => {
  return {
    template: require('./todos.html'),
    controller: 'TodosCtrl'
  }
};

class TodosCtrl {
  constructor($cookies, $http) {

  }
}

export { TodosCtrl, todosComponent };
