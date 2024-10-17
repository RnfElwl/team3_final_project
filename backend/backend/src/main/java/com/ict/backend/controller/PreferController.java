package com.ict.backend.controller;


import com.ict.backend.service.PreferService;
import com.ict.backend.vo.PreferVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prefer")
public class PreferController {

    @Autowired
    private PreferService preferService;

    // 특정 movie_code의 장르 조회 API
    @GetMapping("/genre/{movieCode}")
    public ResponseEntity<String> getGenreByMovieCode(@PathVariable String movieCode) {
        String genre = preferService.getGenreByMovieCode(movieCode);
        if (genre != null) {
            return ResponseEntity.ok(genre);
        } else {
            return ResponseEntity.status(404).body("Movie genre not found");
        }
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveUserPreference(@RequestBody PreferVO preferVO) {
        try {
            System.out.println("Saving preference: " + preferVO); // 요청 데이터 로그
            preferService.saveUserPreference(preferVO);
            System.out.println("Preference saved successfully"); // 서비스 호출 후 로그
            return ResponseEntity.ok("Preference saved successfully");
        } catch (Exception e) {
            System.err.println("Error saving preference: " + e.getMessage()); // 에러 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save preference");
        }
    }
}
