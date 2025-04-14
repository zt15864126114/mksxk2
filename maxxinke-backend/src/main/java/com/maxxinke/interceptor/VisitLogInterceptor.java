package com.maxxinke.interceptor;

import com.maxxinke.entity.VisitLog;
import com.maxxinke.repository.VisitLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 访问日志拦截器
 * 用于拦截HTTP请求并记录访问日志
 * 只记录GET请求的页面访问，用于统计网站访问量
 */
@Component
public class VisitLogInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(VisitLogInterceptor.class);
    
    // 用于记录用户最近访问时间的缓存，key为"IP"，value为最后访问时间
    private final Map<String, LocalDateTime> lastVisitCache = new ConcurrentHashMap<>();
    
    // 同一用户访问的最小间隔时间（秒）
    private static final int MIN_VISIT_INTERVAL_SECONDS = 30;

    @Autowired
    private VisitLogRepository visitLogRepository;

    /**
     * 在请求处理之前进行调用
     * 记录访问日志信息到数据库
     *
     * @param request 当前HTTP请求
     * @param response HTTP响应
     * @param handler 请求处理器
     * @return true表示继续处理请求，false表示中断请求处理
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 只记录GET请求
        if (!"GET".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String ip = getClientIp(request);
        
        // 检查是否是同一用户短时间内重复访问
        LocalDateTime lastVisit = lastVisitCache.get(ip);
        LocalDateTime now = LocalDateTime.now();
        
        if (lastVisit != null) {
            long secondsSinceLastVisit = java.time.Duration.between(lastVisit, now).getSeconds();
            if (secondsSinceLastVisit < MIN_VISIT_INTERVAL_SECONDS) {
                logger.debug("Skipping repeated visit from IP: {}, seconds since last visit: {}", 
                        ip, secondsSinceLastVisit);
                return true;
            }
        }

        try {
            // 记录访问日志
            VisitLog visitLog = new VisitLog();
            visitLog.setPath(request.getRequestURI());
            visitLog.setIp(ip);
            visitLog.setUserAgent(request.getHeader("User-Agent"));
            visitLogRepository.save(visitLog);
            
            // 更新最后访问时间
            lastVisitCache.put(ip, now);
            
            logger.info("Recorded website visit from IP: {}", ip);
        } catch (Exception e) {
            logger.error("Failed to record visit: error={}", e.getMessage());
        }

        return true;
    }

    /**
     * 获取客户端真实IP地址
     * 依次从多个HTTP头部字段中获取IP地址
     * 考虑了代理服务器的情况
     *
     * @param request HTTP请求
     * @return 客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
} 