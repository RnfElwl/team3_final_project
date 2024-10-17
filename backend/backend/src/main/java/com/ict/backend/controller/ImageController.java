package com.ict.backend.controller;

import com.ict.backend.service.ImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
public class ImageController {
    @Autowired
    ImageService imageService;

    @GetMapping("/images/{foldername}/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String foldername, @PathVariable String filename) {
        //System.out.println("ImageController 여기 들어옴"  +foldername+ "/" + filename);

        String currentDir = System.getProperty("user.dir");
        Path imagePath = Paths.get(currentDir+ "/images/" + foldername+ "/" + filename);
        //System.out.println("imagepath = " + imagePath);
        //Path imagePath = Paths.get("D:/team3_final_project/images/" + foldername+ "/" + filename);
        try {
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(imagePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("잘못된 URL: {}", e.getMessage());
            return ResponseEntity.badRequest().build(); // 잘못된 요청
        } catch (Exception e) {
            log.error("서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 오류
        }
    }

    @GetMapping("/get-masonry-images")
    public ResponseEntity<List<ImageResponse>> getMasonryImages() {
        List<ImageResponse> images = new ArrayList<>();

        // 서버에 저장된 이미지 파일들을 관리하는 예시입니다.
        // 실제 파일 위치나 데이터베이스 경로 정보를 사용하여 이미지 URL 생성

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/nGeaz06pGANC01qrk2nOuEOOT3K.jpg"));
        images.add(new ImageResponse("https://www.themoviedb.org/t/p/w600_and_h900_bestv2/oGEJcbizXLYJL6ZQ0ylQDOTC3s9.jpg"));

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w300_and_h450_bestv2/WqgLrAbPnEfgn7WP7J2IvL1Z9V.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/ubcXF21nUkm1ijkH7ZFCm0pzkMm.jpg"));
        images.add(new ImageResponse("https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wBsVETlndUADx0VN0VTtLn837PD.jpg"));

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w300_and_h450_bestv2/dA1TGJPTVjlqPc8PiEE2PfvFBUp.jpg"));
        images.add(new ImageResponse("https://image.tmdb.org/t/p/original/xx0VTrtvoRptaY3unl61Ecft8MI.jpg"));

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w300_and_h450_bestv2/rOPGYktxPcWpkwvhrT70Wm8u9Bv.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/tQUMGWbH9RpYnbKjszRFReHCI5z.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w300_and_h450_bestv2/7qOhFQhvuCZ1hEJHJTWkFo75Vsm.jpg"));

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/kMu5jS1se94vYhZ0LVT8KgXA1os.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/1JHAXXc8pacHGeX67jhBoPghrMv.jpg"));

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w300_and_h450_bestv2/7zV8FTYofAORGm0Umgh1mNNCym8.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w300_and_h450_bestv2/7qOhFQhvuCZ1hEJHJTWkFo75Vsm.jpg"));

        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/hvcRBMF7XhhOIMFFizuCTn3AJeH.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/lgXIXfZiedBtGu2gbzaRdeGMEHm.jpg"));
        images.add(new ImageResponse("https://media.themoviedb.org/t/p/w533_and_h300_bestv2/A2J1gek0KoP1MrULBmvsv3rMMQO.jpg"));

        // 더 많은 이미지를 추가

        return ResponseEntity.ok(images);
    }
    public static class ImageResponse {
        private String src;

        public ImageResponse(String src) {
            this.src = src;
        }

        public String getSrc() {
            return src;
        }

        public void setSrc(String src) {
            this.src = src;
        }
    }
}
