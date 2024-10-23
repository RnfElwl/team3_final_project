// Modal.js (공통 모달 컴포넌트)
import React from 'react';
//import './Modal.css';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import profile from '../../img/profile.png';

function Modal({ onClose, title, children, className}) {
    const combinedClassName = `modal-content ${className || ''}`.trim();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={combinedClassName} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div>{children}</div>  {/* 전달된 내용을 출력 */}
        {/* <button onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} style={{color: "#ffffff",}} />
        </button> */}
        <FontAwesomeIcon icon={faXmark} size ="2x" style={{color: "#ffffff",position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={onClose} />
      </div>
    </div>
  );
}

export default Modal;