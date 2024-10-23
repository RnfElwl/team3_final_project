// src/components/Footer.js
import React from 'react';
import './css/Footer.css';
import {Link} from 'react-router-dom';


function Footer() {
    return (
        <footer className='footer'>
            <div className='footer-info'>
                <div className='logo-container'>
                    <img src='../../logo3.png' className='logo' />
                </div>
                <div className='detail'>
                    <div className='office'>
                        <p>(주) 씬넘버</p>
                        <p>주소 : 서울 성동구 아차산로 113 2층 203호 ICT 인재개발원</p>
                    </div>
                    <div className='contact'>
                        <p>대표이사 : 차은우</p>
                        <p>tel : 010 - 2222 - 8888 </p>
                        <p>email : finalproject@scenen.com</p>
                    </div>
                    
                </div>
            </div>
            <div className='footer-bottom'>
                <p> © 2024 SCENE NUMBER. All rights reserved. Powered by React and Node.js </p>
                <p> Privacy Policy | Terms of Service </p>
            </div>
        </footer>
        );
    }
    

export default Footer;
