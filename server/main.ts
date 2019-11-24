import createApp from './createApp';
import connectDb from './connectDb';
import Koa from 'koa';

const main = async () => {
  const db = (await connectDb()).db('todo');
  const app: Koa = createApp(db);
  const httpd = app.listen(3000);
  console.log('Server running on port 3000');
};

main();
