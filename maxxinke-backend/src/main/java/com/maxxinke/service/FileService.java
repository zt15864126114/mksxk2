package com.maxxinke.service;

import com.maxxinke.entity.File;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * 文件服务接口
 * 定义文件上传、删除、查询等业务操作
 */
public interface FileService {
    
    /**
     * 上传文件
     * @param file 文件对象
     * @param userId 上传用户ID
     * @return 上传后的文件信息
     */
    File uploadFile(MultipartFile file, Long userId);
    
    /**
     * 删除文件
     * @param id 文件ID
     */
    void deleteFile(Long id);
    
    /**
     * 根据ID获取文件
     * @param id 文件ID
     * @return 文件对象
     */
    File getFileById(Long id);
    
    /**
     * 根据URL获取文件
     * @param url 文件URL
     * @return 文件对象
     */
    File getFileByUrl(String url);
    
    /**
     * 获取用户上传的所有文件
     * @param userId 用户ID
     * @return 文件列表
     */
    List<File> getFilesByUserId(Long userId);
    
    /**
     * 生成文件访问的临时URL
     * @param filename 文件名
     * @return 临时访问URL
     */
    String generateSignedUrl(String filename);
} 