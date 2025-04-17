package com.maxxinke.config;

import com.maxxinke.security.JwtAuthenticationFilter;
import com.maxxinke.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import javax.servlet.http.HttpServletResponse;

import java.util.Arrays;

/**
 * Spring Security配置类
 * 配置安全相关的bean和过滤器链
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * 配置密码编码器
     * 使用BCrypt算法进行密码加密
     * 
     * @return 密码编码器实例
     */
    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        // 使用固定的盐值来确保密码哈希一致
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        
        // 测试密码编码
        String rawPassword = "123456";
        String encodedPassword = encoder.encode(rawPassword);
        logger.debug("Raw password: {}", rawPassword);
        logger.debug("Encoded password: {}", encodedPassword);
        
        // 测试密码匹配
        String knownEncodedPassword = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
        boolean matches = encoder.matches(rawPassword, knownEncodedPassword);
        logger.debug("Password matches test result: {}", matches);
        
        if (!matches) {
            logger.warn("Password hash mismatch! Please ensure the password in database matches the encoder settings.");
        }
        
        return encoder;
    }
    
    /**
     * 配置认证管理器
     * 用于处理用户认证请求
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        logger.debug("Configuring authentication manager");
        return authConfig.getAuthenticationManager();
    }
    
    /**
     * 配置安全过滤器链
     * 设置URL访问权限、禁用CSRF、启用CORS等
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.debug("Configuring security filter chain");
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                // 公开接口
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/product/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/news/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/about-us/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/contact/**").permitAll()
                // 需要认证的接口
                .antMatchers(HttpMethod.POST, "/api/messages/**").authenticated()
                .antMatchers(HttpMethod.PUT, "/api/messages/**").authenticated()
                .antMatchers(HttpMethod.DELETE, "/api/messages/**").authenticated()
                // 需要管理员权限的接口
                .antMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/news/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/news/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/news/**").hasRole("ADMIN")
                .antMatchers("/api/admins/**").hasRole("ADMIN")
                .antMatchers("/api/dashboard/**").hasRole("ADMIN")
                .antMatchers("/api/system/**").hasRole("ADMIN")
                // Swagger UI paths
                .antMatchers("/swagger-ui/**",
                        "/swagger-resources/**",
                        "/v2/api-docs/**",
                        "/v3/api-docs/**",
                        "/configuration/**",
                        "/webjars/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling()
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"message\":\"未授权访问\",\"code\":401}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"message\":\"没有权限访问\",\"code\":403}");
                });

        logger.debug("Security filter chain configuration completed");
        return http.build();
    }
    
    /**
     * 配置CORS
     * 允许跨域请求
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.debug("Configuring CORS");
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001", "http://localhost:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        logger.debug("CORS configuration completed");
        return source;
    }
} 