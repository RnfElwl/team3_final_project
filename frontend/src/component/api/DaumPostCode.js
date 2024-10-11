import React from 'react';
import Modal from './Modal'; // 모달 컴포넌트 import
import DaumPostcode from 'react-daum-postcode';

const AddressModal = ({ isOpen, onClose, onComplete }) => {
    const themeObj = {
        bgColor: "#252525", // 바탕 배경색
        searchBgColor: "#252525", // 검색창 배경색
        contentBgColor: "#252525", // 본문 배경색
        pageBgColor: "#252525", // 페이지 배경색
        textColor: "#ffffff", // 기본 글자색
        queryTextColor: "#ffffff", // 검색창 글자색
        postcodeTextColor: "#ffffff", // 우편번호 글자색
        emphTextColor: "#ff0000", // 강조 글자색
        outlineColor: "#ffffff", // 테두리 색상
    };

    if (!isOpen) return null; // 모달이 열려있지 않으면 null 반환

    return (
        <Modal onClose={onClose} title="" className="addrmodal">
            <DaumPostcode
                theme={themeObj}
                onComplete={onComplete} // 주소 선택 처리 함수 전달
            />
        </Modal>
    );
};

export default AddressModal;
