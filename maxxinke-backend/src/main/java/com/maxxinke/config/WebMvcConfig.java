package com.maxxinke.config;

import com.maxxinke.interceptor.VisitLogInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC配置类
 * 用于配置Spring MVC的相关功能
 * 主要用于注册拦截器等Web相关配置
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private VisitLogInterceptor visitLogInterceptor;

    /**
     * 添加拦截器配置
     * 配置访问日志拦截器的路径匹配规则
     *
     * @param registry 拦截器注册表
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(visitLogInterceptor)
            .addPathPatterns("/")  // 只拦截根路径
            .addPathPatterns("/products/**")  // 产品页面
            .addPathPatterns("/news/**")  // 新闻页面
            .excludePathPatterns(
                "/api/**",         // 排除所有API请求
                "/static/**",      // 排除静态资源
                "/admin/**",       // 排除管理后台
                "/dashboard/**",   // 排除仪表盘
                "/*.ico",          // 排除图标
                "/*.js",           // 排除js文件
                "/*.css",          // 排除css文件
                "/*.png",          // 排除图片
                "/*.jpg",
                "/*.gif"
            );
    }
} 