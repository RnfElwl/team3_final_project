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
    int updateBanDateWrite(BanVO banData);
    int deleteBanHistory(List<String> userids);
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
    int updateMemActiveOne(Integer activeState, String userid);
    List<CommunityVO> getComList(PagingVO pagingVO);
    int getTotalComRecord(PagingVO pagingVO);
    List<CommentVO> getComMenList(PagingVO pagingVO);
    int getTotalComMenRecord(PagingVO pagingVO);
    List<CommentReplyVO> getReplyList(PagingVO pagingVO);
    int getTotalComRepRecord(PagingVO pagingVO);
    int updateCommunityState(String userid,List<Integer> communityNos, Integer activeState);
    int updateCommentState(String userid,List<Integer> commentNos, Integer activeState);
    int updateReplyState(String userid,List<Integer> replyNos, Integer activeState);
    int insertNotice(NoticeVO noticeVO);
    List <NoticeVO> selectAdminNoticeList(NoticeVO noticeVO);
    List <NoticeVO> getNotice(int no);
    int updateNotice(NoticeVO noticeVO);
    int updateNoticeActive(Integer active_state,List<Integer> notice_no);
    List<MovieVO> selectAdminMovieList(MovieVO movieVO);
    int updateMovieActive(Integer active, List<Integer> movie_no, String userid);
    int updateMovieData(MovieVO movieVO);
    List<EventVO> selectAdminEventList(EventVO eventVO);
    int insertEvent(EventVO eventVO);
    List<EventVO> getEvent(int no);
    int updateEventData(EventVO eventVO);
    int updateEventActive(Integer event_active_state, List<Integer>event_no, String userid);
    List <EventFCVO> selectEventMemList(int event_no);
}
