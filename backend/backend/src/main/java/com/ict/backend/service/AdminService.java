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
    List<BanVO> getBanMemList(PagingVO pagingVO);
    List<ReportVO> getRepList(PagingVO pagingVO);
    List<ReportVO> getRepView(int report_no);
    List<BanVO> getBanData(String reported_userid);
    int updateUserReport(Integer report_no,String edit_user,Integer active_state,Integer edit_state);
    int banChk(String reported_userid);
    int insertUserBan(BanVO banvo);
    int updateUserBan(BanVO banvo);
    int updateMemActive(Integer activeState, List<String> userids);
    int updateMemActiveOne(Integer activeState, String userid);
    List<CommunityVO> getComList(PagingVO pagingVO);
    int getTotalComRecord(PagingVO pagingVO);
    List<CommentVO> getComMenList(PagingVO pagingVO);
    int getTotalComMenRecord(PagingVO pagingVO);
    List<CommentReplyVO> getReplyList(PagingVO pagingVO);
    int getTotalComRepRecord(PagingVO pagingVO);
    List<MovieVO> selectAdminMovieList(MovieVO movieVO);
    int updateMovieActive(Integer active, List<Integer> movie_no, String userid);
    int updateMovieData(MovieVO movieVO);
}
