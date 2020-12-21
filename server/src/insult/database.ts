import * as opentracing from "opentracing";
const MongoClient = require("mongodb").MongoClient;

import { createSpan, finishSpanWithResult } from "../helper/jaeger";

const url = "mongodb://root:rootpassword@localhost";

export const findAll = async (parentSpanContext: opentracing.SpanContext) => {
  // Get all inserts from database.
  const traceSpan = createSpan(
    "insult.database",
    "insult.database.findAll",
    null,
    parentSpanContext
  );
  const mongoClient = await MongoClient.connect(url);
  const db = mongoClient.db("insult-me");

  const insults = await db.collection("insults").find({}).toArray();
  if (!insults) {
    finishSpanWithResult(traceSpan, 404);
    return null;
  }
  finishSpanWithResult(traceSpan, 200);
  return insults;
};

export const insert = async (
  parentSpanContext: opentracing.SpanContext,
  id: string,
  content: string
) => {
  // Insert the new insult in mongo db.
  const traceSpan = createSpan(
    "insult.database",
    "insult.database.insert",
    null,
    parentSpanContext
  );

  const mongoClient = await MongoClient.connect(url);
  const db = mongoClient.db("insult-me");
  const insult = await db.collection("insults").insertOne({
    id: id,
    content: content,
  });

  if (!insult) {
    finishSpanWithResult(traceSpan, 404);
    return null;
  }

  finishSpanWithResult(traceSpan, 200);
  return insult.ops[0];
};
