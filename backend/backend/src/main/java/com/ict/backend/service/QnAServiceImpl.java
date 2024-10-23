package com.ict.backend.service;

import com.ict.backend.dao.QnADAO;
import com.ict.backend.vo.ImageVO;
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
        List<QnAVO> qnaList = dao.getQnAView(qna_no);
        for (QnAVO qna : qnaList) {
            Integer prevNo = getPrevData(qna.getQna_no());// 이전 QnA 번호 설정
            if (prevNo != null) { //값이 있을 경우
                qna.setPrev_qna_no(prevNo);
                String prevTitle=getPrevTitle(prevNo);
                qna.setPrev_title(prevTitle);
                String prevPrivacyQ=getPrevPrivacyQ(prevNo);
                qna.setPrev_privacyQ(prevPrivacyQ);
            }else{ //값이 없을 경우
                qna.setPrev_qna_no(0);
            }

            Integer nextNo = getNextData(qna.getQna_no());
            if (nextNo != null) {
                qna.setNext_qna_no(nextNo);
                String nextTitle=getNextTitle(nextNo);
                qna.setNext_title(nextTitle);
                String nextPrivacyQ=getNextPrivacyQ(nextNo);
                qna.setNext_privacyQ(nextPrivacyQ);
            }else{
                qna.setNext_qna_no(0);
            }
        }

        return qnaList;
    }

    private String getNextPrivacyQ(Integer nextNo) {
        return dao.getNextPrivacyQ(nextNo);
    }

    private String getPrevPrivacyQ(Integer prevNo) {
        return dao.getPrevPrivacyQ(prevNo);
    }

    private String getNextTitle(Integer nextNo) {
        return dao.getNextTitle(nextNo);
    }

    private String getPrevTitle(Integer prevNo) {
        return dao.getPrevTitle(prevNo);
    }

    private Integer getNextData(int qna_no) {
        return dao.getNextQnaNo(qna_no);
    }

    private Integer getPrevData(int qna_no) {
        return dao.getPrevQnaNo(qna_no);
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
    public int qnaDel(int qna_no, String userid) {
        return dao.qnaDel(qna_no, userid);
    }

    @Override
    public int uploadImage(String imageUrl) {

        return dao.uploadImage(imageUrl);
    }

    @Override
    public String getImgPath(int qna_no) {
        return dao.getImgPath(qna_no);
    }

    @Override
    public Integer qnaImgNumGet(int qna_no) {
        return dao.qnaImgNumGet(qna_no);
    }


    @Override
    public void updateImgUrl(String updatedImgUrl, int qnaPath) {
        dao.updateImgUrl(updatedImgUrl, qnaPath);
    }

    @Override
    public Integer insertImgUrl(String newImgUrl) {
        ImageVO imgVO=new ImageVO();
        imgVO.setImage_url(newImgUrl);
        dao.insertImgUrl(imgVO);
        return imgVO.getImage_no();
    }
//큐앤에이 비밀글 체크
    @Override
    public int passWriteChk(QnAVO passCheck) {
        return dao.passWriteChk(passCheck);
    }


//    @Override
//    public String getQnaImg(int qna_no) {
//        return dao.getQnaImg(qna_no);
//    }


}
