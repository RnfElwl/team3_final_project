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
    public void removeBookmark(BookmarkVO bookmark) {
        bookmarkDAO.removeBookmark(bookmark);
    }

    @Override
    public boolean isBookmarked(String userid, int movieNo) {
        return bookmarkDAO.isBookmarked(userid, movieNo);
    }
}
