package com.maxxinke.repository;

import com.maxxinke.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByUploadedById(Long userId);
    Optional<File> findByUrl(String url);
} 