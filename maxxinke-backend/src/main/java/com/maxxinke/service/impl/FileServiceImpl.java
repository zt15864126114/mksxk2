package com.maxxinke.service.impl;

import com.aliyun.oss.OSS;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.maxxinke.entity.File;
import com.maxxinke.entity.User;
import com.maxxinke.repository.FileRepository;
import com.maxxinke.repository.UserRepository;
import com.maxxinke.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 文件服务实现类
 * 实现FileService接口定义的所有业务方法
 */
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    
    private final OSS ossClient;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    
    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;
    
    @Value("${aliyun.oss.domain}")
    private String domain;
    
    /**
     * 上传文件
     * @param file 文件对象
     * @param userId 用户ID
     * @return 文件实体对象
     */
    @Override
    @Transactional
    public File uploadFile(MultipartFile file, Long userId) {
        try {
            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // 上传到OSS
            ossClient.putObject(bucketName, filename, file.getInputStream());
            
            // 保存文件信息
            File fileEntity = new File();
            fileEntity.setFilename(filename);
            fileEntity.setOriginalName(originalFilename);
            fileEntity.setUrl(domain + "/" + filename);
            fileEntity.setSize(file.getSize());
            fileEntity.setMimeType(file.getContentType());
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            fileEntity.setUploadedBy(user);
            
            return fileRepository.save(fileEntity);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
    
    /**
     * 删除文件
     * @param id 文件ID
     */
    @Override
    @Transactional
    public void deleteFile(Long id) {
        File file = getFileById(id);
        ossClient.deleteObject(bucketName, file.getFilename());
        fileRepository.deleteById(id);
    }
    
    /**
     * 根据ID获取文件
     * @param id 文件ID
     * @return 文件实体对象
     */
    @Override
    public File getFileById(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }
    
    /**
     * 根据URL获取文件
     * @param url 文件URL
     * @return 文件实体对象
     */
    @Override
    public File getFileByUrl(String url) {
        return fileRepository.findByUrl(url)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }
    
    /**
     * 获取用户上传的文件列表
     * @param userId 用户ID
     * @return 文件列表
     */
    @Override
    public List<File> getFilesByUserId(Long userId) {
        return fileRepository.findByUploadedById(userId);
    }
    
    /**
     * 生成文件签名URL
     * @param url 文件URL
     * @return 签名URL
     */
    @Override
    public String generateSignedUrl(String url) {
        File file = getFileByUrl(url);
        Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000); // 1小时过期
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, file.getFilename());
        request.setExpiration(expiration);
        URL signedUrl = ossClient.generatePresignedUrl(request);
        return signedUrl.toString();
    }
} 