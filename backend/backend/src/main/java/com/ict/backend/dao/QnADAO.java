package com.ict.backend.dao;

import com.ict.backend.vo.ImageVO;
import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;

import java.util.List;

public interface QnADAO {
    int getTotalRecord(PagingVO pagingVO);
    List<QnAVO> getQnAList(PagingVO pagingVO);
    List<QnAVO> getQnAView(int qna_no);
    int qnaInsert(QnAVO qnaData);
    List<QnAVO> getQnAViewEdit(int qna_no);
    void qnaUpdate(QnAVO editData);
    void qnaDel(int qna_no, String userid);
    int uploadImage(String imageUrl);
    String getImgPath(int qna_no);
    Integer qnaImgNumGet(int qna_no);
    void updateImgUrl(String updatedImgUrl, int qnaPath);
    void insertImgUrl(ImageVO imgVO);
    Integer getPrevQnaNo(int qna_no); //이전 글 번호 가져오는거
    Integer getNextQnaNo(int qna_no);
}
