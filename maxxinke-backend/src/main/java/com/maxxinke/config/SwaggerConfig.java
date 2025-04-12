package com.maxxinke.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

/**
 * Swagger配置类
 * 配置API文档生成
 */
@Configuration
@EnableSwagger2WebMvc
public class SwaggerConfig {
    
    /**
     * 创建API文档配置
     * 
     * @return API文档配置
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.maxxinke.controller"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo());
    }
    
    /**
     * 创建API基本信息
     * 
     * @return API基本信息
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("麦克斯鑫科 API 文档")
                .description("麦克斯鑫科后台管理系统 API 接口文档")
                .version("1.0.0")
                .contact(new Contact("麦克斯鑫科", "https://www.maxxinke.com", "contact@maxxinke.com"))
                .build();
    }
} 