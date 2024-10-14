package com.ict.backend.controller;

import com.ict.backend.service.BookmarkService;
import com.ict.backend.vo.BookmarkVO;
import org.apache.commons.collections4.Get;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    // 북마크 추가
    @PostMapping("/add")
    public ResponseEntity<String> addBookmark(@RequestBody Map<String, String> requestBody) throws Exception {
        String movie_no = requestBody.get("movie_no");
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("여기" + userid + " movie_no : " + movie_no);

        try {
            bookmarkService.addBookmark(userid, Integer.parseInt(movie_no));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid movie_no format");
        }

        return ResponseEntity.ok("Bookmark added successfully.");
    }

    // 북마크 삭제
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeBookmark(@RequestBody BookmarkVO bookmark) {
        bookmarkService.removeBookmark(bookmark);
        return ResponseEntity.ok("Bookmark removed successfully.");
    }

    // 특정 영화의 북마크 여부 확인
    @GetMapping("/{userid}/{movieNo}")
    public ResponseEntity<Boolean> isBookmarked(@PathVariable("userid") String userid, @PathVariable("movieNo") int movieNo) {
        boolean isFavorite = bookmarkService.isBookmarked(userid, movieNo);
        return ResponseEntity.ok(isFavorite);
    }
}
