'use strict';

import bodyParser from 'body-parser';
import express from 'express';

import todos from './todos';

export const app: express.Express = express();
const api = express.Router();
export const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// API Routes.
api.get('/', function (req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok');
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


const _handleApiResponse = (res: any, successStatus?: number): Function => {
  return ((err: any, payload: any) => {
    if (err) {
      console.error(err);
      res.status(err.code).send(err.message);
      return;
    }
    if (successStatus) {
      res.status(successStatus);
    }
    res.json(payload);
  });
}

// docker-compose開発環境用
if(process.env.DATASTORE_EMULATOR_HOST) {
  app.use('/api/v1', api);
}
// 本番環境
else {
  app.use('/', express.static(__dirname + '/staticDir'));
  app.use('/api/v1', api);
}