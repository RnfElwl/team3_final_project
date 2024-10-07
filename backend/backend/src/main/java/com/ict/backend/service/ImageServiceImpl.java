package com.ict.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageServiceImpl implements ImageService {
    String currentDir = System.getProperty("user.dir");
    private final Path UPLOAD_DIR = Paths.get(currentDir, "images").normalize();

    public ResponseEntity<Resource> getImage(String imagePath) {
        try {
            Path filePath = Paths.get(imagePath);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                String extension = getFileExtension(imagePath);
                MediaType mediaType = MediaType.IMAGE_JPEG; // 기본값으로 JPEG 설정

                if ("png".equalsIgnoreCase(extension)) {
                    mediaType = MediaType.IMAGE_PNG;
                } else if ("gif".equalsIgnoreCase(extension)) {
                    mediaType = MediaType.IMAGE_GIF;
                }
                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public String uploadImage(MultipartFile file, String folder) throws Exception {
        Path path = UPLOAD_DIR.resolve(folder).resolve(file.getOriginalFilename()).normalize();
        //Path path = Paths.get(UPLOAD_DIR + "/"  + folder + "/" + file.getOriginalFilename());

        path = getUniqueFileName(path);

        Files.createDirectories(path.getParent()); // 디렉토리 생성
        Files.write(path, file.getBytes()); // 파일 저장
        return path.toString(); // 저장된 이미지 경로 반환
    }

    public String updateImage(MultipartFile file, String folder, String existingFilePath) throws Exception {
        // 기존 파일 삭제
        if (existingFilePath != null && !existingFilePath.isEmpty()) {
            deleteFile(existingFilePath);
        }

        // 새 파일 저장 경로
        String originalFilename = file.getOriginalFilename();
        //Path path = Paths.get(UPLOAD_DIR + "/" + folder + "/" + originalFilename);
        Path path = UPLOAD_DIR.resolve(folder).resolve(file.getOriginalFilename()).normalize();

        // 중복 파일명 처리
        path = getUniqueFileName(path);

        // 디렉토리 생성 및 파일 저장
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        return path.toString(); // 저장된 이미지 경로 반환
    }
    private String getFileExtension(String filePath) {
        String extension = "";
        int i = filePath.lastIndexOf('.');
        if (i > 0) {
            extension = filePath.substring(i + 1);
        }
        return extension;
    }

    private Path getUniqueFileName(Path path) {
        String fileNameWithoutExt = path.getFileName().toString().substring(0, path.getFileName().toString().lastIndexOf('.'));
        String fileExtension = path.getFileName().toString().substring(path.getFileName().toString().lastIndexOf('.'));
        int count = 1;

        while (Files.exists(path)) {
            String newFileName = fileNameWithoutExt + "_" + count + fileExtension;
            path = path.getParent().resolve(newFileName);
            count++;
        }

        return path; // 고유한 파일 경로 반환
    }
    private void deleteFile(String filePath) throws Exception {
        Path path = Paths.get(filePath);
        if (Files.exists(path)) {
            Files.delete(path); // 파일 삭제
        }
    }
}
