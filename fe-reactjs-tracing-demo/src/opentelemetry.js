import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray"

import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";

import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";


//exporters
import {
  // ConsoleSpanExporter,
  SimpleSpanProcessor,
  // BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";

// The SemanticResourceAttributes is an enum that provides a set of predefined attribute keys for commonly used attributes in OpenTelemetry to maintain consistency across different OpenTelemetry implementations
const resourceSettings = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "fe-reactjs-tracing-demo",
  [SemanticResourceAttributes.SERVICE_VERSION]: '0.0.1',
});

const provider = new WebTracerProvider({resource: resourceSettings});


const startOtelInstrumentation = () => {
  provider.shutdown();
  const collectorOptions = {
    url: process.env.REACT_APP_PUBLIC_TRACE_URL,
    headers: {
      "Authorization" : `Bearer ${getTokenFromLocalStorage()}`
    }, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 10, // an optional limit on pending requests
  }
  const oltpTraceExporter = new OTLPTraceExporter(collectorOptions);
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.addSpanProcessor(new SimpleSpanProcessor(oltpTraceExporter));

  // ZoneContextManager is a context manager implementation based on the Zone.js library. It enables context propagation within the application using zones.
  provider.register({
    contextManager: new ZoneContextManager(),
    // Configure the propagator to enable context propagation between services using the W3C Trace Headers
    propagator: new CompositePropagator({
      propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator(), new AWSXRayPropagator()],
    }),
  });

  console.info(`Registering Otel ${new Date().getMilliseconds()}`);
  // Registering instrumentations
  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        "@opentelemetry/instrumentation-xml-http-request": {
          enabled:true,
          ignoreUrls: [
            "/localhost:8081/sockjs-node"
          ],
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [
            // /.+/g
            [new RegExp(process.env.REACT_APP_PUBLIC_BE_URL)]
          ]
        },
        // Open this block in case you want to trace document load
        // "@opentelemetry/instrumentation-document-load": {
        //   enabled: true
        // },
        // Open this block if you want to trace user interaction
        // "@opentelemetry/instrumentation-user-interaction": {
        //   enabled:true
        // },
      }),
    ],
  });
};

const getTokenFromLocalStorage = () => {
  console.log(`Get Authorization token ${localStorage.getItem('keycloak-token')}`);
  return localStorage.getItem('keycloak-token');
}

export { startOtelInstrumentation };