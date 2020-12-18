import * as opentracing from "opentracing";
const initJaegerTracer = require("jaeger-client").initTracer;

const initTracer = (serviceName: string) => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: false, // when set to true, this logs whenever we send a span
    },
  };
  const options = {
    logger: {
      info: function logInfo(msg: string) {
        console.log("INFO  ", msg);
      },
      error: function logError(msg: string) {
        console.log("ERROR ", msg);
      },
    },
  };
  return initJaegerTracer(config, options);
};

const extractParentSpanContext = (
  parentSpanContext?: opentracing.SpanContext,
  headers?: any
): opentracing.SpanContext => {
  if (parentSpanContext) {
    return parentSpanContext;
  }

  return tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
};

// NOTE: OpenTracing type definitions at <https://github.com/opentracing/opentracing-javascript/blob/master/src/tracer.ts>
export const createSpan = (
  controller: string,
  operation: string,
  headers?: any,
  parentSpan?: opentracing.SpanContext
) => {
  const parentSpanContext: opentracing.SpanContext = extractParentSpanContext(
    parentSpan,
    headers
  );

  const traceSpan: opentracing.Span = tracer.startSpan(operation, {
    childOf: parentSpanContext,
    tags: {
      [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
      [opentracing.Tags.COMPONENT]: controller,
    },
  });
  return traceSpan;
};

export const finishSpanWithResult = (
  span: opentracing.Span,
  status: Number,
  errorTag?: boolean
) => {
  span.setTag(opentracing.Tags.HTTP_STATUS_CODE, status);
  if (errorTag) {
    span.setTag(opentracing.Tags.ERROR, true);
  }
  span.finish();
};

export const tracer = initTracer("insult-me-server") as opentracing.Tracer;
