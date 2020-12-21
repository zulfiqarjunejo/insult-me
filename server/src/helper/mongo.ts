import mongodb from "mongodb";
const MongoClient = require("mongodb").MongoClient;

export const createConnection = async (url: string): Promise<any> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  return client;
};
