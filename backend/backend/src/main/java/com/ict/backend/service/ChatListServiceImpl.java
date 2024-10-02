package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.vo.ChatListVO;
import com.ict.backend.vo.ChatVO;
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

    public int insertChatList(ChatListVO chatListVO){
        return chatListDAO.insertChatList(chatListVO);
    }
    public List<ChatListVO> selectOpenChatList(){
        return chatListDAO.selectOpenChatList();
    }
    public List<ChatVO> selectChatContent(String chatlist_url){
        return chatListDAO.selectChatContent(chatlist_url);
    }
    public int insertChatEnter(String chatlist_url, String userid){
        return chatListDAO.insertChatEnter(chatlist_url, userid);
    }

}
