package com.ict.backend.service;

import com.ict.backend.vo.*;

import java.util.List;

public interface AdminService {
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
    int updateMemActive(Integer activeState, List<String> userids);
    List<CommunityVO> getComList(PagingVO pagingVO);
    int getTotalComRecord(PagingVO pagingVO);
}
