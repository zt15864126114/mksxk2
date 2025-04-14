package com.maxxinke.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import java.util.TimeZone;
import javax.annotation.PostConstruct;

@Configuration
public class TimeConfig {
    
    @PostConstruct
    void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
    }
} 