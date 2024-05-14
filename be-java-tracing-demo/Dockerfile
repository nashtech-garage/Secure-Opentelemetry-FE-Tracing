FROM amazoncorretto:21
ADD target/be-java-tracing-demo-0.0.1-SNAPSHOT.jar be-java-tracing-demo-0.0.1-SNAPSHOT.jar
ADD https://github.com/aws-observability/aws-otel-java-instrumentation/releases/latest/download/aws-opentelemetry-agent.jar /opt/aws-opentelemetry-agent.jar
ENV JAVA_TOOL_OPTIONS=-javaagent:/opt/aws-opentelemetry-agent.jar

ENTRYPOINT ["java", "-jar", "/be-java-tracing-demo-0.0.1-SNAPSHOT.jar"]