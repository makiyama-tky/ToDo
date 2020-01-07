import connectDb from './connectDb';
import createApp from './createApp';
import _axios from 'axios';
import { ObjectId, MongoClient, Collection } from 'mongodb';
import { Server } from 'http';

const axios = _axios.create({
  validateStatus: () => true,
  baseURL: 'http://localhost:3004'
});

let http: Server,
  client: MongoClient,
  collection: Collection,
  testDocumentId: ObjectId;

beforeEach(async () => {
  client = await connectDb();
  const db = client.db('todo-test');
  collection = db.collection('items');
  testDocumentId = new ObjectId();
  await collection.deleteMany({});
  await collection.insertOne({
    _id: testDocumentId,
    name: 'Homework',
    done: false
  });
  const app = createApp(db);
  http = app.listen(3004);
});

afterEach(async () => {
  http.close();
  await client.close();
});

test('GET', async () => {
  const res = await axios.get('/items');
  expect(res.status).toBe(200);
  expect(res.data).toHaveLength(1);
  expect(res.data[0]).toMatchObject({ name: 'Homework', done: false });
});

describe('POST', () => {
  test('create new item', async () => {
    const res = await axios.post('/items', 'Shopping', {
      headers: { 'content-type': 'text/plain' }
    });
    expect(res.status).toBe(204);
    const item = await collection.findOne(
      { name: 'Shopping' },
      { projection: { _id: false } }
    );
    expect(item).toStrictEqual({ name: 'Shopping', done: false });
  });

  test('error on long body', async () => {
    const res = await axios.post('/items', 'a'.repeat(101), {
      headers: { 'content-type': 'text/plain' }
    });
    expect(res.status).toBe(400);
  });

  test('only accept text', async () => {
    const res = await axios.post('/items', { apple: 7 });
    expect(res.status).toBe(400);
  });

  test('error on no body', async () => {
    const res = await axios.post('/items', '   ', {
      headers: { 'content-type': 'text/plain' }
    });
    expect(res.status).toBe(400);
  });
});

describe('PATCH', () => {
  test('change "done" field', async () => {
    const res = await axios.patch('/items/' + testDocumentId, {
      done: true
    });
    expect(res.status).toBe(204);
    const item = await collection.findOne({ _id: testDocumentId });
    expect(item).toStrictEqual({
      _id: testDocumentId,
      name: 'Homework',
      done: true
    });
  });

  test('"done" field only accept boolean', async () => {
    const res = await axios.patch('/items/' + testDocumentId, {
      done: 'true'
    });
    expect(res.status).toBe(400);
  });

  test('"done" field must exist', async () => {
    const res = await axios.patch('/items/' + testDocumentId, {});
    expect(res.status).toBe(400);
  });

  test('do not accept fields other than done', async () => {
    const res = await axios.patch('/items/' + testDocumentId, {
      done: true,
      apple: 7
    });
    expect(res.status).toBe(400);
  });

  test('returns 404 for nonexistent document', async () => {
    const res = await axios.patch('/items/abcxyz', { done: true });
    expect(res.status).toBe(404);
    const res2 = await axios.patch('/items/111112222233333444445555', {
      done: true
    });
    expect(res2.status).toBe(404);
  });
});

describe('DELETE', () => {
  test('delete posted document', async () => {
    const res = await axios.delete('/items/' + testDocumentId);
    expect(res.status).toBe(204);
    const item = await collection.findOne({ _id: testDocumentId });
    expect(item).toStrictEqual(null);
  });

  test('returns 404 for nonexistent document', async () => {
    const res = await axios.delete('/items/abcxyz');
    expect(res.status).toBe(404);
    const res2 = await axios.delete('/items/111112222233333444445555');
    expect(res2.status).toBe(404);
  });
});
