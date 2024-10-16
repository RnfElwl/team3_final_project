package com.ict.backend.dao;

import com.ict.backend.vo.BookmarkVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BookmarkDAO {

    void addBookmark(@Param("userid") String userid, @Param("movie_no") int movieNo);
    void removeBookmark(@Param("userid") String userid, @Param("movie_no") int movieNo);
    boolean isBookmarked(@Param("userid") String userid, @Param("movie_no") int movieNo); // 북마크 여부 확인

}
