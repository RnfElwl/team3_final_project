import "../../css/recommend/recommend.css";
import React, { useState, useEffect } from 'react';
import axios from '../../component/api/axiosApi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';

function Recommend(){

    return(
        <div className="recommend">
            <div className="container">
                <div className="recommend_header">
                    <p className="choice"></p>
                </div>
                <div className="recommend_list">
                    <img className="poster" src={} alt="poster"/>
                    <div className="movie_info">
                        <p className="movie_title"></p>
                        <p className="product_year"></p>
                        <p className="movie_genre"></p>
                        <p className="movie_state"></p>
                    </div>
                    <div className="rate">
                        {[...Array(5)].map((_, index) => (
                            <i 
                                key={index} 
                                className="fa fa-star star-icon"
                                onClick={() => handleStarClick(movie.id)} 
                            />  
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recommend;