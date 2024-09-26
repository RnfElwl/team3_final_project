package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.vo.ChatListVO;
import org.springframework.beans.factory.annotation.Autowired;

public interface ChatListService {
    public int insertChatList(ChatListVO chatListVO);
}
