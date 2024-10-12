import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../css/mypage/seemore.css';
import profile from '../../img/profile.png';
import { useNavigate } from 'react-router-dom';
import poster_image from '../../img/05.jpeg';


function BookMarked() {

    return (
        <div className="SeeMore">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "seemoreinfo">
                    <div className = "seemoretitle">
                        <span>즐겨찾기</span>
                    </div>
                </div>
                <div className = "otherinfo">
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart" onClick={() => alert("Heart 버튼이 클릭되었습니다!")}></button>
                        </div>
                        <div className='moivetitle'>
                            <span>영화1</span>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                    <div className = "moviecontent">
                        <div className='moiveimage'>
                            <img src = {poster_image} alt = "이미지"/>
                            <button className ="heart"></button>
                        </div>
                        <div className='moivetitle'>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default BookMarked;