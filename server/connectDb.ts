import { MongoClient } from 'mongodb';

const connectDb = async () => {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017', {
    useUnifiedTopology: true
  });
  return client;
};

export default connectDb;
