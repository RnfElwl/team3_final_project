package com.ict.backend.dao;

import com.ict.backend.vo.ChatListVO;

import java.util.Arrays;
import java.util.List;

public interface ChatListDAO {
    public int insertChatList(ChatListVO chatListVO);
    public List<ChatListVO> selectOpenChatList();
}
