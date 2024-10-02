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
    public List<ChatVO> selectChatContent(String chatlist_url);
    public int insertChatEnter(String chatlist_url, String userid);
}
