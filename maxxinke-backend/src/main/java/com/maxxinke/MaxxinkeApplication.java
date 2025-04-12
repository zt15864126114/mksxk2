package com.maxxinke;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * 麦克斯鑫科后端应用程序入口类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.maxxinke")
@EntityScan(basePackages = "com.maxxinke.entity")
@EnableJpaRepositories(basePackages = "com.maxxinke.repository")
public class MaxxinkeApplication {
    
    /**
     * 应用程序的主入口方法
     * 启动Spring Boot应用程序
     * 
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        SpringApplication.run(MaxxinkeApplication.class, args);
    }
} 