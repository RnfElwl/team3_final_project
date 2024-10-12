package com.ict.backend.service;

import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;

import java.util.List;

public interface QnAService {
    int getTotalRecord(PagingVO pagingVO);
    List<QnAVO> getQnAList(PagingVO pagingVO);
    List<QnAVO> getQnAView(int qna_no);
    int qnaInsert(QnAVO qnaData);
    List<QnAVO> getQnAViewEdit(int qna_no);
    void qnaUpdate(QnAVO editData);
    void qnaDel(int qna_no, String userid);
    int uploadImage(String imageUrl);
//    String getQnaImg(int qna_no);
}
