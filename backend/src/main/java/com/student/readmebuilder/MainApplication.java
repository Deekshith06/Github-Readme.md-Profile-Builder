package com.student.readmebuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This is the entry point of our Spring Boot app.
// @SpringBootApplication does 3 things at once:
//   1. Marks this as the configuration class
//   2. Enables component scanning (finds @Controller, @Service etc)
//   3. Enables auto-configuration (sets up web server, json etc)
@SpringBootApplication
public class MainApplication {

    public static void main(String[] args) {
        // This one line boots up the entire web server - pretty cool right?
        SpringApplication.run(MainApplication.class, args);
        System.out.println("✅ README Builder is running at http://localhost:8080");
    }
}
