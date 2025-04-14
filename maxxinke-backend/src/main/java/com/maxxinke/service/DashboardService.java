package com.maxxinke.service;

import com.maxxinke.dto.CategoryDataDTO;
import com.maxxinke.dto.DashboardStatsDTO;
import com.maxxinke.dto.VisitDataDTO;

import java.util.List;

public interface DashboardService {
    DashboardStatsDTO getStats();
    List<VisitDataDTO> getVisitData();
    List<VisitDataDTO> getDailyVisitData();
    List<VisitDataDTO> getYearlyVisitData();
    List<CategoryDataDTO> getCategoryData();
    List<Object> getRecentMessages();
    List<Object> getRecentNews();
} 