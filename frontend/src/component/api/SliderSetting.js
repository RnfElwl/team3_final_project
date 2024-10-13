import poster from '../../img/F03.jpeg';
import poster1 from '../../img/poster1.png';
import poster2 from '../../img/poster2.png';
import poster3 from '../../img/poster3.png';
import poster4 from '../../img/poster4.png';
import poster5 from '../../img/poster5.png';
import profile from '../../img/profile.png';
// SliderSetting.js
// 뒤가 없으면 더 못가게
export const SliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1660,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: true
      }
    },
    {
      breakpoint: 1328,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: true
      }
    },
    {
      breakpoint: 996,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 664,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

// export default SliderSettings;

// 멀티 가능한 슬라이더
export const AdaptiveHeightSettings = {
  infinite: false,
  slidesToShow: 7,
  slidesToScroll: 7,
  adaptiveHeight: true,
  initialSlide: 0,
  variableWidth: false,
  responsive: [
    {
      breakpoint: 1561,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6
        
      }
    },
    {
      breakpoint: 1338,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5
        
      }
    },
    {
      breakpoint: 1115,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4

      }
    },
    {
      breakpoint: 892,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 669,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 446,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

// 이미지 세팅

export const recentSlides = [
  { movie_link: poster1, movie_kor: "김과장", movie_code: "1234" }
];

export const bookmarkSlides = [
  { movie_link: poster1, movie_kor: "김과장", movie_code: "1234" },
  { movie_link: poster2, movie_kor: "굿파트너", movie_code: "1234" },
  { movie_link: poster3, movie_kor: "모법택시", movie_code: "1234" },
  { movie_link: poster1, movie_kor: "김과장", movie_code: "1234" },
  { movie_link: poster2, movie_kor: "굿파트너", movie_code: "1234" },
  { movie_link: poster3, movie_kor: "모법택시", movie_code: "1234" },
  { movie_link: poster4, movie_kor: "천변", movie_code: "1234" },
  { movie_link: poster5, movie_kor: "피노키오", movie_code: "1234" },
  { movie_link: poster, movie_kor: "뚱이", movie_code: "1234" },
  { movie_link: poster2, movie_kor: "굿파트너", movie_code: "1234" },
];

// userprofile용 세팅
export const useprofileSlides = [
  { image_url: profile, usernick: "hi"},
  { image_url: profile, usernick: "bye"},
  { image_url: profile, usernick: "new"},
  { image_url: poster1, usernick: "last"},
  { image_url: profile, usernick: "hi"},
  { image_url: profile, usernick: "bye"},
  { image_url: profile, usernick: "new"},
  { image_url: poster1, usernick: "last"},
];

// 빈 슬라이드 추가
export function fillProfileSlides() {
  const slides = [...useprofileSlides];
  while (slides.length < 7) {
      slides.push({ imgSrc: "empty", nick: "", className: "empty-slide", userid: "" }); // 빈 슬라이드 추가
  }
  return slides;
}