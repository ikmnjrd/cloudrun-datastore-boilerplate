'use strict';

const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

datastore.auth.getProjectId((err:any, projectId:any) => {
  if (err) {
    console.error('Error detecting current project.');
    console.error(err);
  }
  console.log(`Using project ${projectId}`);
});

const LIST_NAME = 'default-list';

function entityToTodo (entity:any) {
  const key = entity[datastore.KEY];

  entity.id = key.name || key.id;
  return entity;
}

function saveTodo (key:any, data:any, callback:any) {
  delete data.id;

  datastore.save({
    key: key,
    data: data
  }, function (err:any) {
    if (err) {
      callback(err);
      return;
    }

    data.id = key.id;
    callback(null, data);
  });
}

export default {
  delete: function (id:any, callback:any) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo', id]);

    datastore.delete(key, function (err:any) {
      callback(err || null);
    });
  },

  deleteCompleted: function (callback:any) {
    const transaction = datastore.transaction();

    transaction.run(function (err:any, transaction:any) {
      if (err) {
        console.error(err);
      }
      const query = transaction.createQuery('Todo')
        .hasAncestor(datastore.key(['TodoList', LIST_NAME]))
        .filter('completed', true);

      query.run(function (err:any, items:any) {
        if (err) {
          transaction.rollback(callback);
          return;
        }

        transaction.delete(items.map(function (todo:any) {
          return todo.key;
        }));

        transaction.commit(callback);
      });
    });
  },

  get: function (id:any, callback:any) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo', id]);

    datastore.get(key, function (err:any, item:any) {
      if (err) {
        callback(err);
        return;
      }

      if (!item) {
        callback({ // eslint-disable-line
          code: 404,
          message: 'No matching entity was found.'
        });
        return;
      }

      callback(null, entityToTodo(item));
    });
  },

  getAll: function (callback:any) {
    const query = datastore.createQuery('Todo')
      .hasAncestor(datastore.key(['TodoList', LIST_NAME]));

    query.run(function (err:any, items:any) {
      if (err) {
        callback(err);
        return;
      }

      callback(null, items.map(entityToTodo));
    });
  },

  insert: function (data: any, callback: any) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo']);

    data.completed = false;

    saveTodo(key, data, callback);
  },

  update: function (id: any, data: any, callback: any) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo', id]);

    saveTodo(key, data, callback);
  }
};