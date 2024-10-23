package com.ict.backend.service;

import com.ict.backend.dao.BookmarkDAO;
import com.ict.backend.vo.BookmarkVO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    @Autowired
    private BookmarkDAO bookmarkDAO;

    @Transactional // 트랜잭션 관리 추가
    @Override
    public void addBookmark(String userid, int movieNo) throws Exception {
        System.out.println("Service - Adding bookmark: userid = " + userid + ", movieNo = " + movieNo);
        try {
            bookmarkDAO.addBookmark(userid, movieNo);
        } catch (Exception e) {
            System.err.println("Error adding bookmark: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스를 통해 자세한 에러 확인
            throw new Exception("Failed to add bookmark");
        }
    }

    @Override
    public void removeBookmark(String userid, int movieNo) {
        bookmarkDAO.removeBookmark(userid, movieNo);
    }

    @Override
    public int getMovieNoByCode(String movieCode) {
        return bookmarkDAO.findMovieNoByCode(movieCode);
    }


    @Override
    public boolean isBookmarked(String userid, int movieNo) {
        // 수정: int 결과를 boolean으로 변환
        int result = bookmarkDAO.isBookmarked(userid, movieNo);
        return result > 0;  // 1이면 true, 0이면 false 반환
    }




}
