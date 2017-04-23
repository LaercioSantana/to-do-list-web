import angular from 'angular';

import Config from '../Config.js';
import '../style/todos.scss';

let todosComponent = () => {
  return {
    template: require('./todos.html'),
    controller: 'TodosCtrl'
  }
};

var priorityColors = ['black', 'red'];

class TodosCtrl {
  constructor($scope) {
    this.$scope = $scope;
    this.$scope.todosList = [];
    this.$scope.priority = "0";
    this.$scope.description = "";

    $scope.onClickPriority = this.onClickPriority.bind(this);
    $scope.priorityIconStyle = this.priorityIconStyle.bind(this);
    $scope.removeTodo = this.removeTodo.bind(this);
    $scope.addTodo = this.addTodo.bind(this);

    this.$scope.todosList.forEach(function(todo){
      this.reactTodoPriority(todo);
    }.bind(this));

    this.ordenateTodos();
  }

  reactTodoPriority(todo){
    var self = this;
    todo._priority = todo.priority;
    Object.defineProperty(todo, 'priority', {
      get: function() { return this._priority; },
      set: function(value) {
        this._priority = value;
        self.ordenateTodos();
      }
    });
  }

  ordenateTodos(){
    var newList = [];
    this.$scope.todosList.sort(function(todoA, todoB){
      return todoB.priority - todoA.priority;
    });

    var priorityLength = 2;
    for(var i = priorityLength; i >= 0; i--){
      var listPriorityGroup = this.$scope.todosList.filter(function(todo){
        return todo.priority == i;
      });

      listPriorityGroup.sort(function(a, b){
        return a.id - b.id;
      });
      newList = newList.concat(listPriorityGroup);
    }

    this.$scope.todosList = newList;
  }

  removeTodo(todo){
    var i = undefined;

    this.$scope.todosList.some(function(todoTest, ind){
      if(todo.id == todoTest.id){
        i = ind;
        return true;
      }
    });

    if(i !== undefined)
      this.$scope.todosList.splice(i, 1);
  }

  addTodo(){
    var todo = {
        "done": false,
        "description": this.$scope.description,
        "priority": parseInt(this.$scope.priority) || 0,
    };

    console.log(this.$scope.priority || 0);

    this.reactTodoPriority(todo);
    this.$scope.todosList.push(todo);
    this.$scope.description = "";
    console.log(this.$scope.todosList);
    this.ordenateTodos();
    console.log(this.$scope.todosList);
  }

  onClickPriority(todo){
   todo.priority = !todo.priority + 0;
  }

  priorityIconStyle(todo){
    return {
      color: priorityColors[!!todo.priority + 0]
    };
  }
}

export { TodosCtrl, todosComponent };
