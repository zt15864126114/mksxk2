package com.maxxinke.service.impl;

import com.maxxinke.dto.CategoryDataDTO;
import com.maxxinke.dto.DashboardStatsDTO;
import com.maxxinke.dto.VisitDataDTO;
import com.maxxinke.entity.Message;
import com.maxxinke.entity.News;
import com.maxxinke.repository.MessageRepository;
import com.maxxinke.repository.NewsRepository;
import com.maxxinke.repository.ProductRepository;
import com.maxxinke.repository.VisitLogRepository;
import com.maxxinke.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 仪表盘服务实现类
 * 提供仪表盘所需的各项统计数据
 */
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final NewsRepository newsRepository;
    private final MessageRepository messageRepository;
    private final VisitLogRepository visitLogRepository;

    /**
     * 获取仪表盘统计数据
     * 包括产品、新闻、消息的总数和增长率，以及访问量统计
     *
     * @return 包含各项统计数据的DTO对象
     */
    @Override
    public DashboardStatsDTO getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // 获取当前统计数据
        long totalProducts = productRepository.count();
        long totalNews = newsRepository.count();
        long totalMessages = messageRepository.count();
        
        // 获取访问量统计
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfYesterday = startOfToday.minusDays(1);
        
        // 统计今日和昨日访问量
        long todayVisits = visitLogRepository.countByTimeRange(startOfToday, now);
        long yesterdayVisits = visitLogRepository.countByTimeRange(startOfYesterday, startOfToday);
        
        // 获取一周前的数据进行对比
        LocalDateTime oneWeekAgo = now.minus(7, ChronoUnit.DAYS);
        
        // 计算消息和新闻的周环比数据
        long lastWeekMessages = messageRepository.findByStatusOrderByCreateTimeDesc(0).stream()
                .filter(msg -> msg.getCreateTime().isAfter(oneWeekAgo))
                .count();
        
        long lastWeekNews = newsRepository.findByStatusOrderByCreateTimeDesc(1).stream()
                .filter(news -> news.getCreateTime().isAfter(oneWeekAgo))
                .count();
        
        // 获取总访问量
        Long totalAllVisits = visitLogRepository.getTotalVisits();
        
        // 设置统计数据
        stats.setTotalProducts(totalProducts);
        stats.setTotalNews(totalNews);
        stats.setTotalMessages(totalMessages);
        stats.setTotalViews(todayVisits);
        // 设置总访问量到DTO中
        stats.setTotalAllViews(totalAllVisits != null ? totalAllVisits : 0L);
        
        // 计算各项数据的增长率
        double messageGrowth = calculateGrowthRate(lastWeekMessages, totalMessages);
        double newsGrowth = calculateGrowthRate(lastWeekNews, totalNews);
        double viewsGrowth = calculateGrowthRate(yesterdayVisits, todayVisits);
        
        stats.setMessageGrowth(messageGrowth);
        stats.setNewsGrowth(newsGrowth);
        stats.setProductGrowth(5.0); // 产品增长率需要单独计算
        stats.setViewsGrowth(viewsGrowth);
        
        return stats;
    }

    /**
     * 获取访问量趋势数据
     * 统计最近6个月的每月访问量
     *
     * @return 包含月份和访问量的数据列表
     */
    @Override
    public List<VisitDataDTO> getVisitData() {
        // 获取最近6个月的访问数据
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixMonthsAgo = now.minus(6, ChronoUnit.MONTHS);
        
        // 从数据库获取访问统计数据
        List<Object[]> monthlyStats = visitLogRepository.countByMonth(sixMonthsAgo, now);
        
        // 转换为DTO
        return monthlyStats.stream()
                .map(stat -> {
                    VisitDataDTO data = new VisitDataDTO();
                    String date = stat[0] != null ? stat[0].toString() : "无数据";
                    int value = stat[1] != null ? ((Number) stat[1]).intValue() : 0;
                    
                    data.setDate(date);
                    data.setValue(value);
                    return data;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取按日访问量数据
     * 统计最近30天的每日访问量
     *
     * @return 包含日期和访问量的数据列表
     */
    @Override
    public List<VisitDataDTO> getDailyVisitData() {
        // 获取最近30天的访问数据
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);

        // 从数据库获取每日访问统计数据
        List<Object[]> dailyStats = visitLogRepository.countByDay(thirtyDaysAgo, now);

        // 转换为DTO
        return dailyStats.stream()
                .map(stat -> {
                    VisitDataDTO data = new VisitDataDTO();
                    String date = stat[0] != null ? stat[0].toString() : "无数据";
                    int value = stat[1] != null ? ((Number) stat[1]).intValue() : 0;

                    data.setDate(date);
                    data.setValue(value);
                    return data;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取按年访问量数据
     * 统计最近3年的每年访问量
     *
     * @return 包含年份和访问量的数据列表
     */
    @Override
    public List<VisitDataDTO> getYearlyVisitData() {
        // 获取最近3年的访问数据
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeYearsAgo = now.minus(3, ChronoUnit.YEARS);

        // 从数据库获取每年访问统计数据
        List<Object[]> yearlyStats = visitLogRepository.countByYear(threeYearsAgo, now);

        // 转换为DTO
        return yearlyStats.stream()
                .map(stat -> {
                    VisitDataDTO data = new VisitDataDTO();
                    String date = stat[0] != null ? stat[0].toString() : "无数据";
                    int value = stat[1] != null ? ((Number) stat[1]).intValue() : 0;

                    data.setDate(date);
                    data.setValue(value);
                    return data;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取产品分类统计数据
     * 统计各个分类下的产品数量
     *
     * @return 包含分类名称和产品数量的数据列表
     */
    @Override
    public List<CategoryDataDTO> getCategoryData() {
        // 从数据库获取产品分类统计数据
        List<Object[]> categoryStats = productRepository.countByCategory();
        
        // 转换为DTO
        return categoryStats.stream()
                .map(stat -> {
                    CategoryDataDTO data = new CategoryDataDTO();
                    data.setCategory(stat[0].toString()); // 分类名称
                    data.setCount(((Number) stat[1]).intValue()); // 产品数量
                    return data;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取最近消息列表
     * 返回最新的5条消息记录
     *
     * @return 包含消息详情的数据列表
     */
    @Override
    public List<Object> getRecentMessages() {
        // 获取最近5条消息
        return messageRepository.findTop5ByOrderByCreateTimeDesc()
                .stream()
                .map(message -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", message.getId());
                    result.put("title", message.getName() + "的留言");
                    result.put("content", message.getContent());
                    result.put("status", message.getStatus() == 0 ? "未读" : "已读");
                    result.put("time", message.getCreateTime());
                    return result;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取最新新闻列表
     * 返回最新的5条新闻记录
     *
     * @return 包含新闻详情的数据列表
     */
    @Override
    public List<Object> getRecentNews() {
        // 获取最近5条新闻
        return newsRepository.findTop5ByOrderByCreateTimeDesc()
                .stream()
                .map(news -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", news.getId());
                    result.put("title", news.getTitle());
                    result.put("type", news.getType());
                    result.put("time", news.getCreateTime());
                    result.put("status", news.getStatus());
                    return result;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * 计算增长率
     * 根据前后两个数值计算百分比增长率
     *
     * @param previous 前一个时间段的数值
     * @param current 当前时间段的数值
     * @return 增长率，以百分比表示
     */
    private double calculateGrowthRate(long previous, long current) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((double)(current - previous) / previous) * 100;
    }

} 