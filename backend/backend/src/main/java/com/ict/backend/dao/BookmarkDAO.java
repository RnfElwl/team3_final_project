package com.ict.backend.dao;

import com.ict.backend.vo.BookmarkVO;

public interface BookmarkDAO {


    public default void addBookmark(String userid, int movieNo) {
        System.out.println("Adding bookmark: userid = " + userid + ", movieNo = " + movieNo);

    }
    void removeBookmark(BookmarkVO bookmark);
    boolean isBookmarked(String userid, int movieNo); // 북마크 여부 확인



}
