import { Collection } from 'mongodb';
import { IParamMiddleware } from 'koa-router';

const validateId: (collection: Collection) => IParamMiddleware = collection => {
  return async (id, ctx, next) => {
    if (!id.match(/^[0-9a-f]{24}$/)) ctx.throw(404);
    await next();
  };
};

export default validateId;
