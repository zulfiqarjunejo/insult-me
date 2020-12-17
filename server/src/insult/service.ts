import { v4 as uuidv4 } from "uuid";
import q from "limitedQueue";
const asyncRedis = require("async-redis");

import axios from "../helper/axios";
import Insult from "./model";

const redisClient = asyncRedis.createClient();
redisClient.on("error", function (error) {
  console.error(error);
});

class UserService {
  private idQueue = new q.LimitedQueue(5);

  create = async (): Promise<Insult> => {
    const response = await axios.get(
      "https://insult.mattbas.org/api/insult.txt"
    );
    if (!response.data) {
      return null;
    }

    const insult = new Insult();
    const id = uuidv4();
    insult.id = id;
    insult.content = response.data;

    // Insert the new insult in redis datastore and store the id in queue.
    redisClient.set(id, response.data);
    this.idQueue.enqueue(id);

    return insult;
  };

  all = async (): Promise<Insult[]> => {
    const insults = [];
    const idQueueToArray = this.idQueue.toArray();
    for (let i = 1; i < idQueueToArray.length; i++) {
      const insult = await redisClient.get(idQueueToArray[i]);
      insults.push(insult);
    }

    return insults;
  };
}

export default UserService;
