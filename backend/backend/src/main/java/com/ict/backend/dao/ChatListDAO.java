package com.ict.backend.dao;

import com.ict.backend.vo.ChatListVO;
import com.ict.backend.vo.ChatVO;

import java.util.Arrays;
import java.util.List;

public interface ChatListDAO {
    public int insertChatList(ChatListVO chatListVO);
    public List<ChatListVO> selectOpenChatList();
    public int insertChatEnter(String chatlist_url, String userid);
    public List<ChatVO> selectChatContent(String chatlist_url, String userid);
    public int updateChatHeadCount(String chatlist_url);
    public ChatListVO selectChatRoom(String chatlist_url);
    public List<ChatVO> selectChatMember(String chatlist_url);
}
