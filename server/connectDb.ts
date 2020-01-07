import { MongoClient } from 'mongodb';

const connectDb = async () => {
  if (!process.env.TODO_MONGO_URL)
    throw new Error('TODO_MONGO_URL is not a string');
  const client = await MongoClient.connect(process.env.TODO_MONGO_URL, {
    useUnifiedTopology: true
  });
  return client;
};

export default connectDb;
