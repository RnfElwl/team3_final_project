package com.ict.backend.service;

import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;

import java.util.List;

public interface QnAService {
    List<QnAVO> getQnAList(PagingVO pagingVO);
}
