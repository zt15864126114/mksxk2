package com.maxxinke.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxxinke.entity.ProductSpecification;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 产品规格JSON转换器
 * 用于在数据库JSON类型和Java对象之间进行转换
 */
@Slf4j
@Converter
public class ProductSpecificationConverter implements AttributeConverter<List<ProductSpecification>, String> {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public String convertToDatabaseColumn(List<ProductSpecification> specifications) {
        if (specifications == null || specifications.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(specifications);
        } catch (JsonProcessingException e) {
            log.error("Error converting specifications to JSON: {}", e.getMessage());
            return "[]";
        }
    }
    
    @Override
    public List<ProductSpecification> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<ProductSpecification>>() {});
        } catch (IOException e) {
            log.error("Error converting JSON to specifications: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
} 