package com.maxxinke.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.maxxinke.entity.Admin;
import com.maxxinke.entity.User;
import com.maxxinke.repository.AdminRepository;
import com.maxxinke.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.maxxinke.entity.Role;

import java.util.Collections;

/**
 * 自定义用户详情服务
 * 实现UserDetailsService接口
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Loading user by username: {}", username);
        
        // 首先检查是否是管理员用户
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin != null) {
            logger.debug("Found admin user: {}", admin.getUsername());
            logger.debug("Admin status: {}", admin.getStatus());
            logger.debug("Admin password hash: {}", admin.getPassword());
            
            if (admin.getStatus() != 1) {
                logger.warn("Admin account is disabled: {}", username);
                throw new UsernameNotFoundException("管理员账号已禁用");
            }
            
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                admin.getUsername(),
                admin.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
            logger.debug("Created UserDetails for admin: {}", userDetails);
            return userDetails;
        }
        
        // 如果不是管理员，查找普通用户
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            logger.warn("User not found: {}", username);
            throw new UsernameNotFoundException("用户不存在");
        }
        
        logger.debug("Found regular user: {}", user.getUsername());
        logger.debug("User role: {}", user.getRole());
        logger.debug("User password hash: {}", user.getPassword());
        
        if (user.getRole() != Role.USER) {
            logger.warn("User account has invalid role: {}", username);
            throw new UsernameNotFoundException("用户角色无效");
        }
        
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        logger.debug("Created UserDetails for user: {}", userDetails);
        return userDetails;
    }
} 