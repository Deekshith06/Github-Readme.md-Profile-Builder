# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render exposes the port via the PORT environment variable or defaults to 8080
# Spring Boot runs on 8080 by default
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
