package com.ict.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    ResponseEntity<Resource> getImage(String imagePath);
    String uploadImage(MultipartFile file, String folder) throws Exception;
    String updateImage(MultipartFile file, String folder, String existingFilePath) throws Exception;

    public List<String> getPosterImages();
    public List<String> getCutImages();

}
