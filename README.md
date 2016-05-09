# eats-client
This is the product of a student project (Eats) at Malmö Högskola consisting of 10 students (software engineers and information architects). The goal of this project is a prototype web page that allows users to vote for a restaurant for today's lunch or dinner. A simple yet effective way of reducing conflicts and brawls in offices and teams around Sweden.

This client is dependent on the [eats-api](https://github.com/ChooseMeetDine/eats-api)

### How to start
Clone the repo to your web server folder and make sure you have installed npm and bower on your computer.

Open a terminal window and run:
```
npm install && bower install
```
To start a Node server, run:
```
npm start
```
.. or use another web server of your choice (like Apache in an XAMPP installation).

### Environment variables
This project uses an Angular constant called `__env` as a stand in for real environment variables. 

To be able to run this project, make sure you have the file `js/env.js` with the following content:

```javascript
app.constant('__env', {
  USE_LOCATION: true,
  CLIENT_URL: 'The complete url to this client',
  API_URL: 'The complete url to the API to use',
});
```
