package com.ict.backend.service;

import com.ict.backend.dao.QnADAO;
import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QnAServiceImpl implements QnAService{
    @Autowired
    QnADAO dao;

    @Override
    public List<QnAVO> getQnAList(PagingVO pagingVO) {
        return dao.getQnAList(pagingVO);
    }

    @Override
    public List<QnAVO> getQnAView(int qna_no) {
        return dao.getQnAView(qna_no);
    }
}
