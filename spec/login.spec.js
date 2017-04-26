/*
  @params.url <-- url of the api used in the tests
  @params.email <-- the user email that you want login
  @params.password <-- the password of the user that you want login
*/
describe('To-do list login page', function() {
  browser.params.urlApi = browser.params.urlApi || 'http://localhost:8080';
  var url = browser.params.urlApi;
  beforeEach(function(){
    browser.manage().deleteAllCookies();
    browser.get(url);
  });

  describe('when provided valid email and password', function(){
    beforeEach(function(){
      element(by.model('email')).sendKeys(browser.params.email);
      element(by.model('password')).sendKeys(browser.params.password);
      element(by.css('input[value="Entrar"]')).click();
    });

    it('should login', function() {
      var todolist = element(by.css('.todos-list'));
      expect(todolist.isPresent()).toBe(true);
    });
  })

  describe('when provided invalid email', function(){
    beforeEach(function(){
      element(by.model('email')).sendKeys("wrong email");
      element(by.model('password')).sendKeys(browser.params.password);
      element(by.css('input[value="Entrar"]')).click();
    });

    it('don\'t be login', function() {
      var todolist = element(by.css('.todos-list'));
      expect(todolist.isPresent()).toBe(false);
    });

    it('show the not found email message', function() {
      var todolist = element(by.css('p.bg-danger'));
      expect(todolist.isDisplayed()).toBe(true);
    });
  })

  describe('when provided invalid password', function(){
    beforeEach(function(){
      element(by.model('email')).sendKeys(browser.params.email);
      element(by.model('password')).sendKeys("wrong password");
      element(by.css('input[value="Entrar"]')).click();
    });

    it('don\'t be login', function() {
      var todolist = element(by.css('.todos-list'));
      expect(todolist.isPresent()).toBe(false);
    });

    it('show the not found wrong password message', function() {
      var todolist = element(by.css('p.bg-danger'));
      expect(todolist.isDisplayed()).toBe(true);
    });
  })

});
