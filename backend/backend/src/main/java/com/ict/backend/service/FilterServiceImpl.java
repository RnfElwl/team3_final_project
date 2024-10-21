package com.ict.backend.service;

import com.ict.backend.dao.FilterDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FilterServiceImpl implements FilterService {
    @Autowired
    FilterDAO filterDAO;
    @Override
    public List<Map<String, Object>> TotalFilter(String tab, String column, String userid, String orderType,
                                                 String searchKey,String searchWord, int offset){
        if (tab.equals("community")) {
            if(column.equals("like")){
                return filterDAO.CommunityLikeFilter(column, userid, orderType, searchKey, searchWord, offset);
            }
            return filterDAO.CommunityFilter(column, userid, orderType, searchKey, searchWord, offset);
        } else if (tab.equals("review")) {
            return filterDAO.MovieFilter(column, userid, orderType, searchKey, searchWord, offset);
        }else{
            return null;
        }
    }
    @Override
    public int TotalFilterCount(String tab,String column, String userid, String searchKey, String searchWord){
        if (tab.equals("community")) {
            if(column.equals("like")){
                return filterDAO.CommunityLikeFilterCount(column, userid, searchKey, searchWord);
            }
            return filterDAO.CommunityFilterCount(column, userid, searchKey, searchWord);
        } else if (tab.equals("review")) {
            return filterDAO.MovieFilterCount(column, userid, searchKey, searchWord);
        }else{
            return 0;
        }
    }


    @Override
    public List<Map<String, Object>> CommunityFilter(String column, String userid, String orderType,
                                                     String searchKey, String searchWord, int offset){
        return filterDAO.CommunityFilter(column, userid, orderType, searchKey, searchWord, offset);
    }
    @Override
    public int CommunityFilterCount(String column, String userid, String searchKey, String searchWord){
        return filterDAO.CommunityFilterCount(column, userid, searchKey, searchWord);
    }
    @Override
    public List<Map<String, Object>> CommunityLikeFilter(String column, String userid, String orderType,
                                                     String searchKey, String searchWord, int offset){
        return filterDAO.CommunityLikeFilter(column, userid, orderType, searchKey, searchWord, offset);
    }
    @Override
    public int CommunityLikeFilterCount(String column, String userid, String searchKey, String searchWord){
        return filterDAO.CommunityLikeFilterCount(column, userid, searchKey, searchWord);
    }
    @Override
    public List<Map<String, Object>> MovieFilter(String column, String userid, String orderType,
                                                         String searchKey, String searchWord, int offset){
        return filterDAO.MovieFilter(column, userid, orderType, searchKey, searchWord, offset);
    }
    @Override
    public int MovieFilterCount(String column, String userid, String searchKey, String searchWord){
        return filterDAO.MovieFilterCount(column, userid, searchKey, searchWord);
    }
    @Override
    public List<Map<String, Object>> QnAFilter(String column, String userid, String orderType,
                                                 String searchKey, String searchWord, int offset){
        return filterDAO.QnAFilter(column, userid, orderType, searchKey, searchWord, offset);
    }
    @Override
    public int QnAFilterCount(String column, String userid, String searchKey, String searchWord){
        return filterDAO.QnAFilterCount(column, userid, searchKey, searchWord);
    }
}
