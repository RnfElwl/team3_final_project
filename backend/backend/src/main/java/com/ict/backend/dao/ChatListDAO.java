package com.ict.backend.dao;

import com.ict.backend.vo.*;

import java.util.Arrays;
import java.util.List;

public interface ChatListDAO {
    public int insertChatList(ChatListVO chatListVO);
    public List<ChatListVO> selectOpenChatList(String keyWord);
    public ChatUserVO selectChatUser(String chatlist_url, String userid);
    public int insertChatEnter(String chatlist_url, String userid);
    public List<ChatVO> selectChatContent(String chatlist_url, String userid);
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
}
