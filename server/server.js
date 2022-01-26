'use strict';

const bodyParser = require('body-parser');
const express = require('express');
// const todomvc = require('todomvc');
// const todomvcApi = require('todomvc-api');

const todos = require('./todos.js');

const app = module.exports.app = express();
const api = module.exports.api = express();
module.exports.port = process.env.PORT || 8080;

api.use(bodyParser.json());
// app.use('/api', [todomvcApi.server, api]);

// Declare the root route *before* inserting TodoMVC as middleware to prevent
// the TodoMVC app from overriding it.
// app.get('/', function (req, res) {
//   res.redirect('/examples/angularjs');
// });
// app.use(todomvc);

// Respond to the App Engine health check
app.get('/_ah/health', function (req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok');
});

// API Routes.
api.get('/', function (req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok');
  console.log("hoge");
});

api.get('/todos', function (req, res) {
  todos.getAll(_handleApiResponse(res));
});

api.get('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id, 10);
  todos.get(id, _handleApiResponse(res));
});

api.post('/todos', function (req, res) {
  todos.insert(req.body, _handleApiResponse(res, 201));
});

api.put('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id, 10);
  todos.update(id, req.body, _handleApiResponse(res));
});

api.delete('/todos', function (req, res) {
  todos.deleteCompleted(_handleApiResponse(res, 204));
});

api.delete('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id, 10);
  todos.delete(id, _handleApiResponse(res, 204));
});

function _handleApiResponse (res, successStatus) {
  return function (err, payload) {
    if (err) {
      console.error(err);
      res.status(err.code).send(err.message);
      return;
    }
    if (successStatus) {
      res.status(successStatus);
    }
    res.json(payload);
  };
}