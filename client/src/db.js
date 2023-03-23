const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://shunitou:lcoVqBPKUwKrnlvo@cluster0.xnyrnbf.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  return client.db();
}

module.exports = connectDB;