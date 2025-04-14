package com.maxxinke.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private Long totalProducts;
    private Long totalNews;
    private Long totalMessages;
    private Long totalViews;
    private Long totalAllViews;
    private Double productGrowth;
    private Double newsGrowth;
    private Double messageGrowth;
    private Double viewsGrowth;
} 