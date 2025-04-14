package com.maxxinke.repository;

import com.maxxinke.entity.VisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 访问日志数据访问接口
 * 提供访问日志的基本CRUD操作和自定义查询方法
 */
@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Long> {
    
    /**
     * 统计指定时间段内的访问量
     * 
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 时间段内的访问总数
     */
    @Query("SELECT COUNT(v) FROM VisitLog v WHERE v.createTime BETWEEN :startTime AND :endTime")
    long countByTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    /**
     * 按月统计访问量
     * 返回每月的访问统计数据
     * 
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 包含月份和访问量的数组列表，每个数组包含两个元素：
     *         - 第一个元素(String): 月份，格式为"YYYY-MM"
     *         - 第二个元素(Long): 该月的访问量
     */
    @Query("SELECT FUNCTION('DATE_FORMAT', v.createTime, '%Y-%m') as month, COUNT(v) as count " +
           "FROM VisitLog v " +
           "WHERE v.createTime BETWEEN :startTime AND :endTime " +
           "GROUP BY FUNCTION('DATE_FORMAT', v.createTime, '%Y-%m') " +
           "ORDER BY month")
    List<Object[]> countByMonth(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 统计最近6个月的访问量
     * @return 包含月份和访问量的数组列表
     */
    @Query("SELECT FUNCTION('DATE_FORMAT', v.createTime, '%Y-%m') as month, COUNT(v) as count " +
           "FROM VisitLog v " +
           "WHERE v.createTime >= :startTime " +
           "GROUP BY FUNCTION('DATE_FORMAT', v.createTime, '%Y-%m') " +
           "ORDER BY month ASC")
    List<Object[]> countByMonth(@Param("startTime") LocalDateTime startTime);

    /**
     * 获取总访问量
     */
    @Query("SELECT COUNT(v) FROM VisitLog v")
    Long getTotalVisits();
    
    /**
     * 按日统计访问量
     * 返回每日的访问统计数据
     * 
     * @param startTime 开始时间（30天前）
     * @param endTime 结束时间（当前时间）
     * @return 包含日期和访问量的数组列表，每个数组包含两个元素：
     *         - 第一个元素(String): 日期，格式为"YYYY-MM-DD"
     *         - 第二个元素(Long): 该日的访问量
     */
    @Query("SELECT FUNCTION('DATE_FORMAT', v.createTime, '%Y-%m-%d') as day, COUNT(v) as count " +
           "FROM VisitLog v " +
           "WHERE v.createTime BETWEEN :startTime AND :endTime " +
           "GROUP BY FUNCTION('DATE_FORMAT', v.createTime, '%Y-%m-%d') " +
           "ORDER BY day ASC")
    List<Object[]> countByDay(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 按年统计访问量
     * 返回每年的访问统计数据
     * 
     * @param startTime 开始时间（3年前）
     * @param endTime 结束时间（当前时间）
     * @return 包含年份和访问量的数组列表，每个数组包含两个元素：
     *         - 第一个元素(String): 年份，格式为"YYYY"
     *         - 第二个元素(Long): 该年的访问量
     */
    @Query("SELECT FUNCTION('DATE_FORMAT', v.createTime, '%Y') as year, COUNT(v) as count " +
           "FROM VisitLog v " +
           "WHERE v.createTime BETWEEN :startTime AND :endTime " +
           "GROUP BY FUNCTION('DATE_FORMAT', v.createTime, '%Y') " +
           "ORDER BY year ASC")
    List<Object[]> countByYear(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
} 