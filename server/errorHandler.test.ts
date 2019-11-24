import errorHandler from './errorHandler';
import Koa from 'koa';
import axios from 'axios';

test('errorHandler', async () => {
  const handler = errorHandler();
  const koa = new Koa();
  let httpd;
  try {
    koa.use(handler);
    koa.use(async ctx => {
      throw new Error('Dummy unexpected error');
    });
    httpd = koa.listen(5555);
    const res = await axios.get('http://localhost:5555/', {
      validateStatus: () => true
    });
    expect(res.status).toBe(500);
    expect(res.data).toMatchObject({ message: 'Internal Server Error' });
  } finally {
    if (httpd) httpd.close();
  }
});
