package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ChatListServiceImpl implements ChatListService {

    private ChatListDAO chatListDAO;
    @Autowired
    public ChatListServiceImpl(ChatListDAO chatListDAO){
        this.chatListDAO = chatListDAO;
    }

    public int insertChatMessage(ChatVO chatVO){return chatListDAO.insertChatMessage(chatVO);}
    public int insertChatList(ChatListVO chatListVO){
        return chatListDAO.insertChatList(chatListVO);
    }
    public List<ChatListVO> selectOpenChatList(String keyWord){
        return chatListDAO.selectOpenChatList(keyWord);
    }
    public List<ChatVO> selectChatContent(String chatlist_url, String userid){
        return chatListDAO.selectChatContent(chatlist_url, userid);
    }
    public int insertChatEnter(String chatlist_url, String userid){
        return chatListDAO.insertChatEnter(chatlist_url, userid);
    }
    public ChatUserVO selectChatUser(String chatlist_url, String userid){
        return chatListDAO.selectChatUser(chatlist_url, userid);
    }
    public int updateChatHeadCount(String chatlist_url){
        return chatListDAO.updateChatHeadCount(chatlist_url);
    }
    public ChatListVO selectChatRoom(String chatlist_url){
        return chatListDAO.selectChatRoom(chatlist_url);
    }
    public List<ChatVO> selectChatMember(String chatlist_url){
        return chatListDAO.selectChatMember(chatlist_url);
    }
    public int insertSchedule(ScheduleVO scheduleVO){
        return chatListDAO.insertSchedule(scheduleVO);
    }
    public List<ScheduleVO> selectScheduleList(String chatlist_url, String userid){
        return chatListDAO.selectScheduleList(chatlist_url, userid);
    }
    public int insertScheduleVoting(VotingVO votingVO){
        return chatListDAO.insertScheduleVoting(votingVO);
    }
    public List<MemberVO> selectVoteList(VotingVO votingVO){
        return chatListDAO.selectVoteList(votingVO);
    }
    public int updateChatUserExit(String chatlist_url, String userid, String last_conn){
        return chatListDAO.updateChatUserExit(chatlist_url, userid, last_conn);
    }
    public int updateChatHeadCountExit(String chatlist_url){
        return chatListDAO.updateChatHeadCountExit(chatlist_url);
    }
    public int updateSoloChatUserConn(String chatlist_url, String userid, String last_conn){
        return chatListDAO.updateSoloChatUserConn(chatlist_url, userid, last_conn);
    }
    public List<ChatListVO> selectSoloChatList(String userid, String keyWord){
        return chatListDAO.selectSoloChatList(userid, keyWord);
    }
    public int selectSoloChatCheck(String chatlist_url, String userid){
        return chatListDAO.selectSoloChatCheck(chatlist_url, userid);
    }
    public int updateSoloChatUserFirstConn(String chatlist_url, String userid, String first_conn){
        return chatListDAO.updateSoloChatUserFirstConn(chatlist_url, userid, first_conn);
    }
    public ChatListVO selectSoloChatRoomCheck(String userid1, String userid2){
        return chatListDAO.selectSoloChatRoomCheck(userid1, userid2);
    }
}
