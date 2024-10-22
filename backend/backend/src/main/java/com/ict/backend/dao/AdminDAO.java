package com.ict.backend.dao;

import com.ict.backend.vo.*;
import org.apache.ibatis.annotations.Param;

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
    List<BanVO> getBanMemList(PagingVO pagingVO);
    List<ReportVO> getRepList(PagingVO pagingVO);
    List<ReportVO> getRepView(int report_no);
    List<BanVO> getBanData(String reported_userid);
    int updateUserReport(@Param("report_no") Integer report_no,
                         @Param("edit_user") String edit_user,
                         @Param("active_state") Integer active_state,
                         @Param("edit_state") Integer edit_state);
    int banChk(String reported_userid);
    int insertUserBan(BanVO banvo);
    int updateUserBan(BanVO banvo);
    int updateMemActive(Integer activeState, List<String> userids);
    List<CommunityVO> getComList(PagingVO pagingVO);
    int getTotalComRecord(PagingVO pagingVO);
    List<MovieVO> selectAdminMovieList(MovieVO movieVO);
    int updateMovieActive(Integer active, List<Integer> movie_no, String userid);
    int updateMovieData(MovieVO movieVO);
}
