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
    public int getTotalRecord(PagingVO pagingVO) {
        return dao.getTotalRecord(pagingVO);
    }

    @Override
    public List<QnAVO> getQnAList(PagingVO pagingVO) {
        return dao.getQnAList(pagingVO);
    }

    @Override
    public List<QnAVO> getQnAView(int qna_no) {
        return dao.getQnAView(qna_no);
    }

    @Override
    public int qnaInsert(QnAVO qnaData) {
        return dao.qnaInsert(qnaData);
    }

    @Override
    public List<QnAVO> getQnAViewEdit(int qna_no) {
        return dao.getQnAViewEdit(qna_no);
    }

    @Override
    public void qnaUpdate(QnAVO editData) {
        dao.qnaUpdate(editData);
    }

    @Override
    public void qnaDel(int qna_no, String userid) {
        dao.qnaDel(qna_no, userid);
    }

    @Override
    public int uploadImage(String imageUrl) {

        return dao.uploadImage(imageUrl);
    }


}
