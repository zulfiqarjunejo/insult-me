import * as opentracing from "opentracing";
import { v4 as uuidv4 } from "uuid";
import q from "limitedQueue";
const asyncRedis = require("async-redis");

import axios from "../helper/axios";
import { createSpan, finishSpanWithResult } from "../helper/jaeger";

import Insult from "./model";

const redisClient = asyncRedis.createClient();
redisClient.on("error", function (error) {
  console.error(error);
});

class UserService {
  private idQueue = new q.LimitedQueue(5);

  create = async (
    parentSpanContext: opentracing.SpanContext
  ): Promise<Insult> => {
    const traceSpan = createSpan(
      "insult.service",
      "insult.service.create",
      null,
      parentSpanContext
    );

    const response = await axios.get(
      "https://insult.mattbas.org/api/insult.txt"
    );
    if (!response.data) {
      finishSpanWithResult(traceSpan, 404, true);
      return null;
    }

    const insult = new Insult();
    const id = uuidv4();
    insult.id = id;
    insult.content = response.data;

    // Insert the new insult in redis datastore and store the id in queue.
    redisClient.set(id, response.data);
    this.idQueue.enqueue(id);

    finishSpanWithResult(traceSpan, 200);
    return insult;
  };

  all = async (
    parentSpanContext: opentracing.SpanContext
  ): Promise<Insult[]> => {
    const traceSpan = createSpan(
      "insult.service",
      "insult.service.all",
      null,
      parentSpanContext
    );
    const insults = [];
    const idQueueToArray = this.idQueue.toArray();
    for (let i = 1; i < idQueueToArray.length; i++) {
      const insult = await redisClient.get(idQueueToArray[i]);
      insults.push(insult);
    }

    finishSpanWithResult(traceSpan, 200);
    return insults;
  };
}

export default UserService;
