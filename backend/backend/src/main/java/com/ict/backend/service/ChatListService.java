package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.vo.ChatListVO;
import com.ict.backend.vo.ChatVO;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

public interface ChatListService {
    public int insertChatList(ChatListVO chatListVO);
    public List<ChatListVO> selectOpenChatList();
    public List<ChatVO> selectChatContent(String chatlist_url, String userid);
    public int insertChatEnter(String chatlist_url, String userid);
    public int updateChatHeadCount(String chatlist_url);
    public ChatListVO selectChatRoom(String chatlist_url);
    public List<ChatVO> selectChatMember(String chatlist_url);

}
