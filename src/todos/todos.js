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
  constructor($scope, $http, Auth, AppTodo) {
    this.$scope = $scope;
    this.$http = $http;
    this.Auth = Auth;
    this.$scope.todosList = [];
    this.$scope.priority = "0";
    this.$scope.description = "";

    AppTodo.showExit = true;

    $scope.onClickPriority = this.onClickPriority.bind(this);
    $scope.priorityIconStyle = this.priorityIconStyle.bind(this);
    $scope.removeTodo = this.removeTodo.bind(this);
    $scope.addTodo = this.addTodo.bind(this);
    $scope.updatedTodoToServer = this.updatedTodoToServer.bind(this);

    this.$scope.todosList.forEach(function(todo){
      this.reactTodoPriority(todo);
    }.bind(this));

    this.loadTodosFromServer();
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

  loadTodosFromServer(){
    var end = function(response){
      this.$scope.Loading.busy = false;
    }.bind(this);

    this.$scope.Loading.busy = true;
    this.$http({
      method: 'GET',
      url: Config.api.rootUrl + '/users/todos',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken()
      },
      data: {
        full_name: this.$scope.name,
        email: this.$scope.email,
        password: this.$scope.password
      }
    }).then(function successCallback(response) {
        this.$scope.todosList = response.data;
        this.ordenateTodos();
        end(response);

        if(Config.debug) console.log("loaded todos");
      }.bind(this), function errorCallback(response) {
        end(response);
      }.bind(this));
  }

  addTodoToServer(todo, callback){
    var end = function(response){
      this.$scope.Loading.busy = false;
    }.bind(this);

    this.$scope.Loading.busy = true;
    this.$http({
      method: 'POST',
      url: Config.api.rootUrl + '/users/todos',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken()
      },
      data: {
        description: todo.description,
        done: todo.done,
        priority: todo.priority
      }
    }).then(function successCallback(response) {
        callback && callback(true);
        end(response);
        if(Config.debug) console.log("add to-do to server", todo, response);
      }.bind(this), function errorCallback(response) {
        if(Config.debug) console.log("error to add todo to server.", todo);
        callback && callback(false);
        end(response);
      }.bind(this));
  }

  removeTodoFromServer(todo, callback){
    var end = function(response){
      this.$scope.Loading.busy = false;
    }.bind(this);

    this.$scope.Loading.busy = true;
    this.$http({
      method: 'DELETE',
      url: Config.api.rootUrl + '/users/todos/'+todo.id,
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken()
      }
    }).then(function successCallback(response) {
        callback && callback(true);
        end(response);
        if(Config.debug) console.log("removed to-do from server", todo, response);
      }.bind(this), function errorCallback(response) {
        if(Config.debug) console.log("error to remove todo from server.", todo);
        callback && callback(false);
        end(response);
      }.bind(this));
  }

  updatedTodoToServer(todo, callback){
    var end = function(response){
      this.$scope.Loading.busy = false;
    }.bind(this);

    this.$scope.Loading.busy = true;
    this.$http({
      method: 'PUT',
      url: Config.api.rootUrl + '/users/todos/'+todo.id,
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken()
      },
      data: {
        description: todo.description,
        done: todo.done,
        priority: todo.priority
      }
    }).then(function successCallback(response) {
        callback && callback(true);
        end(response);
        if(Config.debug) console.log("updated to-do to server", todo, response);
      }.bind(this), function errorCallback(response) {
        if(Config.debug) console.log("error to updated todo to server.", todo);
        callback && callback(false);
        end(response);
      }.bind(this));
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

    //TODO: show feedback when error
    this.removeTodoFromServer(todo);
  }

  addTodo(){
    var todo = {
      "done": false,
      "description": this.$scope.description,
      "priority": parseInt(this.$scope.priority) || 0,
    };

    this.reactTodoPriority(todo);
    this.$scope.todosList.push(todo);
    this.$scope.description = "";
    this.ordenateTodos();

    //TODO: show feedback when error
    this.addTodoToServer(todo);
  }

  onClickPriority(todo){
   todo.priority = !todo.priority + 0;
   //TODO: show feedback when error
   this.updatedTodoToServer(todo)
  }

  priorityIconStyle(todo){
    return {
      color: priorityColors[!!todo.priority + 0]
    };
  }
}

export { TodosCtrl, todosComponent };
