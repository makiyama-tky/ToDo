import { ObjectId, Collection } from 'mongodb';
import { Context, Next, Middleware } from 'koa';
import Ajv from 'ajv';

type CollectionMiddleware = (
  collection: Collection
) => (ctx: Context, next: Next) => Promise<void>;

export const handleGet: CollectionMiddleware = collection => {
  return async (ctx, next) => {
    ctx.body = await collection.find().toArray();
  };
};

export const handlePost: CollectionMiddleware = collection => {
  return async (ctx, next) => {
    const name = ctx.request.body;
    if (typeof name !== 'string') ctx.throw(400);
    if (name.length > 100) ctx.throw(400);
    await collection.insertOne({ name, done: false });
    ctx.body = null;
  };
};

export const handlePatch: CollectionMiddleware = collection => {
  return async (ctx, next) => {
    const id = new ObjectId(ctx.params.id);
    const input = ctx.request.body;

    const schema = {
      type: 'object',
      properties: {
        done: { type: 'boolean' }
      },
      required: ['done'],
      additionalProperties: false
    };

    const ajv = new Ajv();
    var valid = ajv.validate(schema, input);
    if (!valid) ctx.throw(400, ajv.errors!.toString());

    const result = await collection.updateOne(
      { _id: id },
      { $set: { done: input.done } }
    );
    if (result.matchedCount !== 1) ctx.throw(404);
    ctx.body = null;
  };
};

export const handleDelete: CollectionMiddleware = collection => {
  return async (ctx, next) => {
    const id = new ObjectId(ctx.params.id);
    const result = await collection.deleteOne({ _id: id });
    if (result.deletedCount !== 1) ctx.throw(404);
    ctx.body = null;
  };
};
