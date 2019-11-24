import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { handleGet, handlePost, handlePatch, handleDelete } from './handlers';
import validateId from './validateId';
import errorHandler from './errorHandler';
import { Db } from 'mongodb';

const createApp: (db: Db) => Koa = db => {
  const app = new Koa();
  app.use(errorHandler());
  app.use(bodyParser({ enableTypes: ['json', 'text'] }));
  const router = new Router();
  const collection = db.collection('items');
  router.param('id', validateId(collection));
  router.get('/items', handleGet(collection));
  router.post('/items', handlePost(collection));
  router.patch('/items/:id', handlePatch(collection));
  router.del('/items/:id', handleDelete(collection));
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};

export default createApp;
