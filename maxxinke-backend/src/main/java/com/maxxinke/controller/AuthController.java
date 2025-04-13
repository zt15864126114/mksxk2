package com.maxxinke.controller;

import com.maxxinke.entity.User;
import com.maxxinke.security.JwtTokenProvider;
import com.maxxinke.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 处理用户注册、登录等认证相关请求
 */
@Api(tags = "认证管理", description = "用户注册、登录等认证相关接口")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册结果
     */
    @ApiOperation(value = "用户注册", notes = "注册新用户，用户名和邮箱不能重复")
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @ApiParam(value = "用户信息", required = true) 
            @RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("用户名已存在");
        }
        
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("邮箱已存在");
        }
        
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }
    
    /**
     * 用户登录
     * @param loginRequest 登录请求（包含用户名和密码）
     * @return 登录结果和JWT令牌
     */
    @ApiOperation(value = "用户登录", notes = "登录并返回JWT令牌")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        logger.debug("Login attempt for username: {}", username);
        logger.debug("Raw password received: {}", password);
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            
            logger.debug("Authentication successful for user: {}", authentication.getName());
            logger.debug("Authentication details: {}", authentication.getDetails());
            logger.debug("Authentication authorities: {}", authentication.getAuthorities());
            
            String token = jwtTokenProvider.generateToken(authentication);
            logger.debug("Generated JWT token for user: {}", authentication.getName());
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            logger.warn("Login failed for username: {} - Bad credentials", username);
            logger.debug("BadCredentialsException details: {}", e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "用户名或密码错误");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
} 