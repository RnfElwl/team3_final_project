package com.ict.backend.service;

import com.ict.backend.vo.BookmarkVO;

public interface BookmarkService {

    void addBookmark(String userid, int movieNo) throws Exception;
    void removeBookmark(BookmarkVO bookmark);
    boolean isBookmarked(String userid, int movieNo); // 북마크 여부 확인



}
