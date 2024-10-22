package com.ict.backend.dao;

import com.ict.backend.vo.*;

import java.util.List;

public interface AdminDAO {
    List<AdminVO> qnaDataSelectMonth();
    List<AdminVO> qnaDataSelectYear();
    List<AdminVO> qnaDataSelectDay();
    List<AdminVO> communityDataSelectMonth();
    List<AdminVO> communityDataSelectYear();
    List<AdminVO> communityDataSelectDay();
    List<AdminVO> qnaSearch(AdminDateVO dateList);
    List<AdminVO> comSearch(AdminDateVO dateList);
    int dailySubscriberSelect();
    int dailyCommunitySelect();
    int dailyQnaSelect();
    int dailyRepSelect();
    List<MemberVO> selectMemberMin();
    int getTotalQnARecord(PagingVO pagingVO);
    List<QnAVO> getQnAList(PagingVO pagingVO);
    int insertQnaAnswer(QnAVO adminQAData);
    int updateQnaActive(Integer activeState, List<Integer>qnaNos);
    List<MemberVO> getMemList(PagingVO pagingVO);
    List<ReportVO> getRepList(PagingVO pagingVO);
    List<ReportVO> getRepView(int report_no);
    int updateMemActive(Integer activeState, List<String> userids);
    List<CommunityVO> getComList(PagingVO pagingVO);
    int getTotalComRecord(PagingVO pagingVO);
    List<MovieVO> selectAdminMovieList(MovieVO movieVO);
    int updateMovieActive(Integer active, List<Integer> movie_no, String userid);
    int updateMovieData(MovieVO movieVO);
}
