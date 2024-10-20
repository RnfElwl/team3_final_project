import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../../css/movies/MovieCategories.css'; // CSS 파일을 임포트
import axios from 'axios';

function MovieCategories() {
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'genre');
  const [yearCategories, setYearCategories] = useState([]);

  useEffect(() => {
    // Fetch year categories from backend (this could be a one-time fetch if year ranges are dynamic)
    axios.get(`http://localhost:9988/api/movies/yearCategories`)
      .then(response => {
        setYearCategories(response.data);
      })
      .catch(error => console.error("Error fetching year categories:", error));
  }, []);

   // 사용자가 탭을 클릭했을 때 로컬 저장소에 저장
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab); // 선택된 탭을 로컬 저장소에 저장
  };

  
  const genreCategories = [
    { id: '드라마', name: '드라마', backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149125685.jpg?t=st=1729403331~exp=1729406931~hmac=5f7e9632aa9442ef4b1b2480effe669f45f1da60bad301a3d064d37b6ad46761&w=900")' },
    { id: '로맨스', name: '로맨스', backgroundImage: 'url("https://img.freepik.com/premium-photo/abstract-red-gold-blurred-bokeh-background_1001175-16803.jpg?w=740")' },
    { id: '액션', name: '액션' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149967281.jpg?t=st=1729403271~exp=1729406871~hmac=4d09c72cfd3471da0456aae7774a8de5101b2cfc4c087003fd32ba463075c59d&w=900")'},
    { id: '다큐멘터리', name: '다큐멘터리' , backgroundImage: 'url("https://img.freepik.com/free-photo/close-up-beautiful-optical-fiber-details_23-2149212576.jpg?t=st=1729406915~exp=1729410515~hmac=4df7fa36d1132a189651f3ee0f331a8f9a5d42d7d1021e52b8beaa3b714869fc&w=740")' },
    { id: '애니메이션', name: '애니메이션' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2148997125.jpg?t=st=1729405998~exp=1729409598~hmac=47aedb1e6818b1d4056278c4806fd419b478781acac9246699b55b55ec305425&w=740")' },
    { id: '코미디', name: '코미디' , backgroundImage: 'url("https://img.freepik.com/premium-photo/abstract-orange-blue-curved-lines-background_1222783-18703.jpg?w=740")'},
    { id: '범죄', name: '범죄' , backgroundImage: 'url("https://img.freepik.com/free-photo/abstract-2d-colorful-wallpaper-with-grainy-gradients_23-2151001646.jpg?t=st=1729405792~exp=1729409392~hmac=157681bb941bc42a48016b81fa71b352dec58c50efe62cf559bce664f624b078&w=740")' },
    { id: '전쟁', name: '전쟁' , backgroundImage: 'url("https://img.freepik.com/free-vector/stylish-trendy-fluid-color-mesh-background_1017-14021.jpg?t=st=1729405650~exp=1729409250~hmac=097ceff55db0945c4f58dcbf85b4d4b754ac2645f2a5beb5b35491eb669c0735&w=1060")' },
    { id: '어드벤처', name: '어드벤처', backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149947343.jpg?t=st=1729403285~exp=1729406885~hmac=a90982f2ab6ae83ab4c16f82b51b0dc32d880322704589f2b2e4377f755038f0&w=900")' },
    { id: '판타지', name: '판타지', backgroundImage: 'url("https://img.freepik.com/premium-photo/painting-some-towers-with-words-name-city_1025435-935.jpg?w=740")' },
    { id: '공포(호러)', name: '공포(호러)' , backgroundImage: 'url("https://img.freepik.com/premium-photo/pink-radio-frequency-waves-red-background-abstract-image-texture-pattern-wallpaper-cover_867671-37567.jpg?w=740")' },
    { id: '가족', name: '가족' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-pink-green-background_23-2150272596.jpg?t=st=1729405577~exp=1729409177~hmac=44357249e2e69c5ae67197fccef8d3d512f67502162da5f76b45f86aa3d70d0d&w=740")'},
    { id: '사극', name: '사극', backgroundImage: 'url("https://img.freepik.com/free-vector/elegant-modern-wave-background-design_1055-248.jpg?t=st=1729406146~exp=1729409746~hmac=616346c291ea8ff11f45742641b0eb7ead35796b5f0036f4f99e4a1951ce38ca&w=740")' },
    { id: 'SF', name: 'SF' , backgroundImage: 'url("https://img.freepik.com/premium-vector/abstract-fluid-new-years-event-poster-template_77673-10.jpg?w=740")'},
    { id: '미스터리', name: '미스터리' , backgroundImage: 'url("https://img.freepik.com/free-vector/modern-blue-abstract-background_23-2147638048.jpg?t=st=1729406074~exp=1729409674~hmac=803a460526cbf42058e9232598c25a22421a76e8fb4dc844b4b8bb791f99ebbd&w=740")'},
    { id: '스릴러', name: '스릴러' , backgroundImage: 'url("https://img.freepik.com/free-photo/abstract-coloured-background-with-variety-transparent-raindrops_23-2148290157.jpg?t=st=1729405923~exp=1729409523~hmac=9d9c6c514175d5c6e78455509bbf5eb2c5a8f098cc76f30008045dd80b200b86&w=740")'}
    
  ];

  const nationCategories = [
    { id: '한국', name: '한국' , backgroundImage: 'url("https://img.freepik.com/premium-photo/harmonious-wallpaper-featuring-south-korean-flag-colors-as-background_879736-73063.jpg?w=1060")'},
    { id: '중국', name: '중국' , backgroundImage: 'url("https://img.freepik.com/premium-photo/photo-light-china-flag-white-background_1077802-141363.jpg?w=1380")' },
    { id: '미국', name: '미국' , backgroundImage: 'url("https://img.freepik.com/premium-photo/abstract-composition-american-flag_1057628-82608.jpg?w=740")'},
    { id: '영국', name: '영국' , backgroundImage: 'url("https://img.freepik.com/premium-photo/abstract-british-flag-with-splatter-paint_204719-16273.jpg?w=1380")'},
    { id: '일본', name: '일본' , backgroundImage: 'url("https://img.freepik.com/premium-photo/abstract-painting-mountain-red-sun_877110-3367.jpg?w=1480")'},
    { id: '프랑스', name: '프랑스' , backgroundImage: 'url("https://img.freepik.com/premium-photo/abstract-french-flag-with-eiffel-tower_86117-6527.jpg?w=900")'},
    { id: '스페인', name: '스페인' , backgroundImage: 'url("https://img.freepik.com/premium-vector/flag-spain-style-grunge-effect-watercolor_546559-905.jpg?w=996")' },
    { id: '홍콩', name: '홍콩' , backgroundImage: 'url("https://img.freepik.com/free-vector/abstract-skyscrapers-illustration_1048-1122.jpg?t=st=1729409778~exp=1729413378~hmac=dd746c407e02894f8314b8aa23549e4b79c9f5b5f7298e53516b58eeca2dabd9&w=740")'},
    { id: '대만', name: '대만' , backgroundImage: 'url("https://img.freepik.com/premium-vector/flag-taiwan-vector-with-old-vintage-texture_602351-397.jpg?w=826")'},
    { id: '이탈리아', name: '이탈리아' , backgroundImage: 'url("https://img.freepik.com/premium-photo/italiy-flag-background-animated_1054941-12079.jpg?w=740")'},
    { id: '덴마크', name: '덴마크' , backgroundImage: 'url("https://img.freepik.com/premium-photo/denmark-national-flag-textured-background_1026950-106860.jpg?w=900")'},
    { id: '스웨덴', name: '스웨덴' , backgroundImage: 'url("https://img.freepik.com/premium-photo/swedish-flag-painted-with-blue-yellow-horizontal-vertical-stripes-textured-background-creative-artistic-style_960080-56456.jpg?w=996")'},
    { id: '브라질', name: '브라질' , backgroundImage: 'url("https://img.freepik.com/premium-photo/brazilian-flag-background-showing-green-yellow-blue-with-brushstrokes_684888-1132.jpg?w=996")'},
    { id: '독일', name: '독일' , backgroundImage: 'url("https://img.freepik.com/free-photo/wavy-flag-germany-texture-background-generative-ai_169016-29908.jpg?t=st=1729410567~exp=1729414167~hmac=fcd7cc76c573fed837a3786473c0b931ca9f4ec9306af8d656d737e6edfd2e70&w=900")'},
    { id: '인도', name: '인도' , backgroundImage: 'url("https://img.freepik.com/premium-vector/abstract-design-indian-flag-taj-mahal-silhouette-geometric-shapes_186298-9723.jpg?w=996")'}
    
    ];

  // 현재 선택된 탭에 따라 표시할 카테고리 결정
  let currentCategories = [];
  if (activeTab === 'genre') {
    currentCategories = genreCategories;
  } else if (activeTab === 'year') {
    currentCategories = yearCategories.length > 0 ? yearCategories : [
      { id: '2024', name: '올해의 영화' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149460639.jpg?t=st=1729413589~exp=1729417189~hmac=bdd19aea8c703fdf4fe64a4babd06a49dc4cc4958745d2df63717166dc0f8c6d&w=996")'},
      { id: '2020', name: '2020년대' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149460643.jpg?t=st=1729413579~exp=1729417179~hmac=0f33ead98bcf6d2272f42224568582e3589c9c23b9ea4063d76769b7cd466abd&w=996")'},
      { id: '2010', name: '2010년대' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149460640.jpg?t=st=1729413649~exp=1729417249~hmac=c3f916e4e81a03aa3c1f15c8fcce2c00e03427680515ed1265a239ae4754e8cc&w=996")'},
      { id: '1990', name: '1990년대' , backgroundImage: 'url("https://img.freepik.com/premium-vector/gradient-abstract-background_23-2149460638.jpg?w=996")'},
      { id: '1980', name: '1980년대' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149460641.jpg?t=st=1729413712~exp=1729417312~hmac=13e364af7f38d875be66bb88c7d16d22eb27b380bd1acccbcd379fcac0af3468&w=996")'},
      { id: '1970', name: '1970년대' , backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-abstract-background_23-2149954658.jpg?t=st=1729413798~exp=1729417398~hmac=66d75424bb9dd40ecbedc4ca33b130a54f4dca0aae34df9266bbc4d40aaeb34d&w=996")'}

    ];
  } else if (activeTab === 'nation') {
    currentCategories = nationCategories;
  }

  return (
    <div className="page-container"> {/* 페이지 전체 배경 */}
      <div className="content-container"> {/* 1200px 중앙 정렬 div */}
        <h1>카테고리</h1>

        {/* 탭 네비게이션 */}
        <ul className="nav nav-tabs mt-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'genre' ? 'active' : ''}`}
              onClick={() => handleTabChange('genre')}
            >
              장르별로 찾기
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'year' ? 'active' : ''}`}
              onClick={() => handleTabChange('year')}
            >
              연도별로 찾기
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'nation' ? 'active' : ''}`}
              onClick={() => handleTabChange('nation')}
            >
              국가별로 찾기
            </button>
          </li>
        </ul>

        {/* 탭 콘텐츠 */}
        <div className="row mt-4">
          {currentCategories.map(category => (
            <div key={category.id} className="col-6 col-sm-4 col-md-2 mb-4">
              <Link to={`/categories/${activeTab}/${category.id}`} className="card-link">
                <div className="card"
                style={{
                  backgroundImage: category.backgroundImage,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                >
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </Link>
            </div> 
          ))} 
        </div> 
      </div>
    </div>
  );
}

export default MovieCategories;
