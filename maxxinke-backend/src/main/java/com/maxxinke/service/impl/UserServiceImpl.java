package com.maxxinke.service.impl;

import com.maxxinke.entity.User;
import com.maxxinke.repository.UserRepository;
import com.maxxinke.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户服务实现类
 * 实现UserService接口定义的所有业务方法
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * 创建新用户
     * @param user 用户实体对象
     * @return 创建成功的用户对象
     */
    @Override
    public User createUser(User user) {
        if (existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    /**
     * 更新用户信息
     * @param user 用户实体对象
     * @return 更新后的用户对象
     */
    @Override
    public User updateUser(User user) {
        User existingUser = getUserById(user.getId());
        if (!existingUser.getUsername().equals(user.getUsername()) && existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (!existingUser.getEmail().equals(user.getEmail()) && existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(existingUser.getPassword());
        }
        return userRepository.save(user);
    }
    
    /**
     * 删除用户
     * @param id 用户ID
     */
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    /**
     * 根据ID获取用户
     * @param id 用户ID
     * @return 用户对象
     */
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * 根据用户名获取用户
     * @param username 用户名
     * @return 用户对象
     */
    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * 获取所有用户列表
     * @return 用户列表
     */
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * 检查用户名是否存在
     * @param username 用户名
     * @return 存在返回true，否则返回false
     */
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * 检查邮箱是否存在
     * @param email 邮箱地址
     * @return 存在返回true，否则返回false
     */
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
} 