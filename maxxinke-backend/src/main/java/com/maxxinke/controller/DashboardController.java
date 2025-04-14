package com.maxxinke.controller;

import com.maxxinke.dto.CategoryDataDTO;
import com.maxxinke.dto.DashboardStatsDTO;
import com.maxxinke.dto.VisitDataDTO;
import com.maxxinke.entity.VisitLog;
import com.maxxinke.repository.VisitLogRepository;
import com.maxxinke.service.DashboardService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Api(tags = "仪表盘接口")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final VisitLogRepository visitLogRepository;
    
    // 用于记录用户最近访问时间的缓存，key为"IP_路径"，value为最后访问时间
    private final Map<String, LocalDateTime> lastVisitCache = new ConcurrentHashMap<>();
    
    // 同一用户访问同一页面的最小间隔时间（秒）
    private static final int MIN_VISIT_INTERVAL_SECONDS = 30;

    @ApiOperation("获取仪表盘统计数据")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @ApiOperation("获取访问量趋势数据")
    @GetMapping("/visits")
    public ResponseEntity<List<VisitDataDTO>> getVisitData() {
        return ResponseEntity.ok(dashboardService.getVisitData());
    }

    @ApiOperation("获取按日访问量趋势数据")
    @GetMapping("/visits/daily")
    public ResponseEntity<List<VisitDataDTO>> getDailyVisitData() {
        return ResponseEntity.ok(dashboardService.getDailyVisitData());
    }

    @ApiOperation("获取按年访问量趋势数据")
    @GetMapping("/visits/yearly")
    public ResponseEntity<List<VisitDataDTO>> getYearlyVisitData() {
        return ResponseEntity.ok(dashboardService.getYearlyVisitData());
    }

    @ApiOperation("记录前台网站访问")
    @GetMapping("/visits/record")
    public ResponseEntity<Void> recordVisit(
            @RequestParam String path,
            @RequestParam(required = false) String title,
            HttpServletRequest request) {
        // 过滤掉后台管理系统的访问
        if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
            return ResponseEntity.ok().build();
        }
        
        // 过滤掉API请求
        if (path.startsWith("/api")) {
            return ResponseEntity.ok().build();
        }

        String ip = getClientIp(request);
        String cacheKey = ip + "_" + path;
        LocalDateTime now = LocalDateTime.now();
        
        // 检查是否是同一用户短时间内重复访问
        LocalDateTime lastVisit = lastVisitCache.get(cacheKey);
        if (lastVisit != null) {
            long secondsSinceLastVisit = java.time.Duration.between(lastVisit, now).getSeconds();
            if (secondsSinceLastVisit < MIN_VISIT_INTERVAL_SECONDS) {
                // 如果访问间隔太短，不记录这次访问
                return ResponseEntity.ok().build();
            }
        }

        // 更新最后访问时间
        lastVisitCache.put(cacheKey, now);

        // 记录访问日志
        VisitLog visitLog = new VisitLog();
        visitLog.setPath(path);
        visitLog.setIp(ip);
        visitLog.setUserAgent(request.getHeader("User-Agent"));
        visitLogRepository.save(visitLog);
        
        return ResponseEntity.ok().build();
    }

    @ApiOperation("获取产品分类统计数据")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDataDTO>> getCategoryData() {
        return ResponseEntity.ok(dashboardService.getCategoryData());
    }

    @ApiOperation("获取最近消息")
    @GetMapping("/recent-messages")
    public ResponseEntity<List<Object>> getRecentMessages() {
        return ResponseEntity.ok(dashboardService.getRecentMessages());
    }

    @ApiOperation("获取最新新闻")
    @GetMapping("/recent-news")
    public ResponseEntity<List<Object>> getRecentNews() {
        return ResponseEntity.ok(dashboardService.getRecentNews());
    }

    /**
     * 获取客户端真实IP地址
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