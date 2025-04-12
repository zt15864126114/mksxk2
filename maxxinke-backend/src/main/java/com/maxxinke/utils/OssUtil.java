package com.maxxinke.utils;

import com.aliyun.oss.OSS;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectRequest;
import com.maxxinke.config.OssConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OssUtil {
    private final OSS ossClient;
    private final OssConfig ossConfig;

    /**
     * 生成唯一的文件名
     * @param originalFilename 原始文件名
     * @return 新的文件名
     */
    private String generateUniqueFilename(String originalFilename) {
        String extension = StringUtils.substringAfterLast(originalFilename, ".");
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        return String.format("%s_%s.%s", timestamp, uuid, extension);
    }

    /**
     * 上传文件到OSS
     * @param file 文件
     * @return 文件访问URL
     */
    public String uploadFile(MultipartFile file) throws IOException {
        String filename = generateUniqueFilename(file.getOriginalFilename());
        
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        
        PutObjectRequest putObjectRequest = new PutObjectRequest(
            ossConfig.getBucketName(),
            filename,
            file.getInputStream(),
            metadata
        );
        
        ossClient.putObject(putObjectRequest);
        
        return String.format("%s/%s", ossConfig.getUrlPrefix(), filename);
    }

    /**
     * 从OSS删除文件
     * @param fileUrl 文件URL
     */
    public void deleteFile(String fileUrl) {
        try {
            log.info("准备删除OSS文件: {}", fileUrl);
            String filename = StringUtils.substringAfterLast(fileUrl, "/");
            if (StringUtils.isNotEmpty(filename)) {
                log.debug("解析到文件名: {}", filename);
                ossClient.deleteObject(ossConfig.getBucketName(), filename);
                log.info("成功删除OSS文件: {}", filename);
            } else {
                log.warn("无法从URL解析文件名: {}", fileUrl);
                throw new IllegalArgumentException("无效的文件URL");
            }
        } catch (Exception e) {
            log.error("删除OSS文件失败: {}, 错误: {}", fileUrl, e.getMessage());
            throw new RuntimeException("删除OSS文件失败: " + e.getMessage());
        }
    }
} 