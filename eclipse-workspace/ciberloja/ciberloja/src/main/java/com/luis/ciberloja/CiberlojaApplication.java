package com.luis.ciberloja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.luis.ciberloja")
@EnableJpaRepositories(basePackages = "com.luis.ciberloja.repository")
public class CiberlojaApplication {
    public static void main(String[] args) {
        SpringApplication.run(CiberlojaApplication.class, args);
    }
}