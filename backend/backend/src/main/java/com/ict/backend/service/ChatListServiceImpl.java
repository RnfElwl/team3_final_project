package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.vo.ChatListVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
