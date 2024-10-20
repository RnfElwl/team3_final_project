package com.ict.backend.service;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface FilterService {
    public List<Map<String, Object>> TotalFilter(String tab, String column, String userid, String orderType,
                                                     String searchKey,String searchWord, int offset);
    public int TotalFilterCount(String tab, String column, String userid, String searchKey, String searchWord);


    public List<Map<String, Object>> CommunityFilter(String column, String userid, String orderType,
                                                     String searchKey,String searchWord, int offset);
    public int CommunityFilterCount(String column, String userid, String searchKey, String searchWord);
    public List<Map<String, Object>> CommunityLikeFilter(String column, String userid, String orderType,
                                                     String searchKey,String searchWord, int offset);
    public int CommunityLikeFilterCount(String column, String userid, String searchKey, String searchWord);
    public List<Map<String, Object>> MovieFilter(String column, String userid, String orderType,
                                                     String searchKey,String searchWord, int offset);
    public int MovieFilterCount(String column, String userid, String searchKey, String searchWord);
    public List<Map<String, Object>> QnAFilter(String column, String userid, String orderType,
                                                 String searchKey,String searchWord, int offset);
    public int QnAFilterCount(String column, String userid, String searchKey, String searchWord);


}
