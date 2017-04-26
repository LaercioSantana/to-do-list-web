/*
  @params.email <-- the user email that you want login
  @params.password <-- the password of the user that you want login
*/
describe('To-do list main page', function() {
  var url = 'http://localhost:8080/#!/todos';
  var descriptionText = "new todo";
  var addButtonText = 'ADICIONAR';
  //cache
  var description = by.model('description');

  var clearList = function(){
    element(description).clear();
    element.all(by.css('[ng-click="removeTodo(todo)"]')).click();//remove all todos
  };

  beforeAll(function(){
    browser.manage().deleteAllCookies();
    browser.get(url);
    element(by.model('email')).sendKeys(browser.params.email);
    element(by.model('password')).sendKeys(browser.params.password);
    element(by.css('input[value="Entrar"]')).click();
  });

  it('should have todos', function() {
    element.all(by.css('.todos-list')).evaluate('todosList').then(function(todos){
      expect(todos.length > -1).toBe(true);
    });
  });

  describe('when valid input', function(){

    beforeEach(clearList);
    afterEach(clearList);

    it('should show the add button', function() {
      element(description).sendKeys(descriptionText);
      expect(element(by.buttonText(addButtonText)).isDisplayed()).toBe(true);
    });

    describe("and add todo button was be clicked", function(){
      it('must be possible to add todo', function(){
        element(description).sendKeys(descriptionText);
        element(by.buttonText(addButtonText)).click();
        expect(element(by.css('.todo label')).getText()).toEqual(descriptionText);
      });

      it('should the todo added have the correct priority', function(){
        //high priority
        element(description).sendKeys(descriptionText);
        element.all(by.model('priority')).get(1).click();
        element(by.buttonText(addButtonText)).click();
        element(by.css('[title="Prioridade"]')).getCssValue('color').then(function(color){
          expect(color).toEqual('rgba(255, 0, 0, 1)');
        });

        element(description).sendKeys(descriptionText);
        element.all(by.model('priority')).get(0).click();
        element(by.buttonText(addButtonText)).click();
        element.all(by.css('[title="Prioridade"]')).get(1).getCssValue('color').then(function(color){
          expect(color).toEqual('rgba(0, 0, 0, 1)');
        });
      });

      it('should the todo have done = false by default', function(){
        element(description).sendKeys(descriptionText);
        element(by.buttonText(addButtonText)).click();
        expect(element(by.css('.todo input[type="checkbox"]')).isSelected('checked')).toBe(false);
      });

    })
  });

  describe("a todo when checked done", function(){
    afterEach(clearList);

    beforeAll(function(){
      clearList();
      element(description).sendKeys(descriptionText);
      element(by.buttonText(addButtonText)).click();
      element(by.css('.todo input[type="checkbox"]')).click();
    });

    it('have a strikethrough text', function(){
      element(by.css('.todo label')).getCssValue('text-decoration').then(function(value){
        expect(value.indexOf('line-through')).toBeGreaterThan(-1);
      });
    });
  });

  it('must be possible to remove a todo', function(){
    clearList();

    //add a todo
    element(description).sendKeys(descriptionText);
    element(by.buttonText(addButtonText)).click();
    element(description).sendKeys(descriptionText+" 2");
    element(by.buttonText(addButtonText)).click();
    var count = element(by.css('.todo'));
    //remove
    expect(element.all(by.css('.todo')).count()).toEqual(2);
    element(by.css('[ng-click="removeTodo(todo)"]')).click();//remove a first todos

    expect(element.all(by.css('.todo')).count()).toEqual(1);
    expect(element(by.css('.todo label')).getText()).toEqual(descriptionText+" 2");
    clearList();
  });

});
