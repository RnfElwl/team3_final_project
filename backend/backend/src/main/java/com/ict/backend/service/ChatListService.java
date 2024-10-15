package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.vo.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

public interface ChatListService {
    public int insertChatMessage(ChatVO chatVO);
    public int insertChatList(ChatListVO chatListVO);
    public List<ChatListVO> selectReviewList(String userid, String keyWord);
    public List<ChatListVO> selectOpenChatList(String keyWord, String userid);
    public List<ChatVO> selectChatContent(String chatlist_url, String userid);
    public ChatUserVO selectChatUser(String chatlist_url, String userid);
    public int insertChatEnter(String chatlist_url, String userid);
    public int updateChatHeadCount(String chatlist_url);
    public ChatListVO selectChatRoom(String chatlist_url);
    public List<ChatVO> selectChatMember(String chatlist_url);
    public int insertSchedule(ScheduleVO scheduleVO);
    public List<ScheduleVO> selectScheduleList(String chatlist_url, String userid);
    public int insertScheduleVoting(VotingVO votingVO);
    public List<MemberVO> selectVoteList(VotingVO votingVO);
    public int updateChatUserExit(String chatlist_url, String userid, String last_conn);
    public int updateChatHeadCountExit(String chatlist_url);
    public int updateSoloChatUserConn(String chatlist_url, String userid, String last_conn);
    public List<ChatListVO> selectSoloChatList(String userid, String keyWord);
    public int selectSoloChatCheck(String chatlist_url, String userid);
    public int updateSoloChatUserFirstConn(String chatlist_url, String userid, String first_conn);
    public ChatListVO selectSoloChatRoomCheck(String userid1, String userid2);
    public String selectUserReviewCheck(String userid, int movie_no);


}
