import * as opentracing from "opentracing";
import { v4 as uuidv4 } from "uuid";
import q from "limitedQueue";

import axios from "../helper/axios";
import { createSpan, finishSpanWithResult } from "../helper/jaeger";

import Insult from "./model";
import { findAll, insert } from "./database";

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

    const insult = await insert(traceSpan.context(), uuidv4(), response.data);

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

    const insults = await findAll(traceSpan.context());

    finishSpanWithResult(traceSpan, 200);
    return insults;
  };
}

export default UserService;
