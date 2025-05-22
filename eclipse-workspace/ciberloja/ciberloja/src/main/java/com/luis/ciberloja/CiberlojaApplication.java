package com.luis.ciberloja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // For cron job
public class CiberlojaApplication {
    public static void main(String[] args) {
        SpringApplication.run(CiberlojaApplication.class, args);
    }
}