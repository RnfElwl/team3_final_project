package com.ict.backend.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface FilterDAO {
    public List<Map<String, Object>> CommunityFilter(@Param("column") String column,
                                                     @Param("userid") String userid,
                                                     @Param("orderType") String orderType,
                                                     @Param("searchKey") String searchKey,
                                                     @Param("searchWord") String searchWord,
                                                     @Param("offset") int offset);
    public int CommunityFilterCount(@Param("column") String column,
                                    @Param("userid") String userid,
                                    @Param("searchKey") String searchKey,
                                    @Param("searchWord") String searchWord);

    public List<Map<String, Object>> CommunityLikeFilter(@Param("column") String column,
                                                     @Param("userid") String userid,
                                                     @Param("orderType") String orderType,
                                                     @Param("searchKey") String searchKey,
                                                     @Param("searchWord") String searchWord,
                                                     @Param("offset") int offset);
    public int CommunityLikeFilterCount(@Param("column") String column,
                                    @Param("userid") String userid,
                                    @Param("searchKey") String searchKey,
                                    @Param("searchWord") String searchWord);
    public List<Map<String, Object>> MovieFilter(@Param("column") String column,
                                                         @Param("userid") String userid,
                                                         @Param("orderType") String orderType,
                                                         @Param("searchKey") String searchKey,
                                                         @Param("searchWord") String searchWord,
                                                         @Param("offset") int offset);
    public int MovieFilterCount(@Param("column") String column,
                                        @Param("userid") String userid,
                                        @Param("searchKey") String searchKey,
                                        @Param("searchWord") String searchWord);
    public List<Map<String, Object>> QnAFilter(@Param("column") String column,
                                                 @Param("userid") String userid,
                                                 @Param("orderType") String orderType,
                                                 @Param("searchKey") String searchKey,
                                                 @Param("searchWord") String searchWord,
                                                 @Param("offset") int offset);
    public int QnAFilterCount(@Param("column") String column,
                                @Param("userid") String userid,
                                @Param("searchKey") String searchKey,
                                @Param("searchWord") String searchWord);
}
