# To-do List Web

Web app that consumes the [to-do-list-api](https://github.com/LaercioSantana/to-do-list-api).

### Usage

```console
$ npm install           # install dependencies
$ npm run server        # run server
$ npm run build         # to build a site into dist folder
```
### Test 

We are use [protactor](https://github.com/angular/protractor) to test e2e, so you need have it installed.

run all tests e2e:

```console
$ protractor spec/conf.js --params.email="email of the valid user" \
                          --params.password="password of the user" \
                          --params.urlApi="url to the api"
```
a possible example:

```console
$ protractor spec/conf.js --params.email="user3@email.com" \
                          --params.password="pass3" \
                          --params.urlApi="https://quiet-bastion-71306.herokuapp.com"
```
