package com.ict.backend.dao;

import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;

import java.util.List;

public interface QnADAO {
    int getTotalRecord(PagingVO pagingVO);
    List<QnAVO> getQnAList(PagingVO pagingVO);
}
