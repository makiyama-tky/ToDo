const Koa = require('koa');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser({ enableTypes: ['json', 'text'] }));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      result: 'error',
      message: err.message
    };
  }
});

app.use(async (ctx, next) => {
  const db = await connectDb();
  const collection = db.collection('items');
  if (ctx.request.method === 'GET') {
    ctx.body = await collection.find().toArray();
  } else if (ctx.request.method === 'POST') {
    const name = ctx.request.body;
    const doc = { name, done: false };
    await collection.insertOne(doc);
    ctx.body = null;
  } else if (ctx.request.method === 'PATCH') {
    const id = ctx.request.path.slice(1);
    const done = ctx.request.body.done;  
    const objectId = new ObjectID(id);
    const result = await collection.updateOne(
      { _id : objectId },
      { $set : { done } }
    );
    const matchedCount = result.matchedCount;
    if (matchedCount !== 0) {
      ctx.body = null;
    } else {
      ctx.throw(404, 'Request item not found');
    }
  }
});

app.listen(3000);

async function connectDb() {
  const url = 'mongodb://127.0.0.1:27017';
  const connection = await MongoClient.connect(
    url, { useUnifiedTopology: true }
  );
  return connection.db('todo');
}