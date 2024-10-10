import react, { useEffect,useState } from 'react';
// import '../App.css';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend,Filler } from 'chart.js';

import axios from "../../component/api/axiosApi";
import './../../css/admin/admin.css'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, Filler);
function AdminTest() {
  //DB 데이터
  const today = new Date();
  const todays_month=`${today.getMonth()+1}`;
  const [inputQnaData, setInputQnaData]=useState([]);
  const [inputComData, setInputComData]=useState([]);
  const [inputS_qnaData, setInputS_qnaData]=useState([]);
  const [inputS_comData, setInputS_comData]=useState([]);
  const [qna_filter, setQna_filter]=useState('년');
  const [community_filter, setCommunity_filter]=useState('월');
  let   qnaData = {};
  let   communityData={};
  let   searchQnaData={};
  let   sQnaData={};
  let   sComData={};
  const [start_qnaDate, setStart_qnaDate]=useState('');
  const [end_qnaDate, setEnd_qnaDate]=useState('');
  const [start_comDate, setStart_comDate]=useState('');
  const [end_comDate, setEnd_comDate]=useState('');
  const [error, setError] = useState(false);
  
  //QnA필터 옵션
  const handleQnaFilterChange = (e) => {
    qnaData={}
    setQna_filter(e.target.value);
    console.log(qna_filter);    
  };
  //커뮤니티 필터 옵션
  const handleCommunityFilterChange=(e)=>{ 
    setCommunity_filter(e.target.value);
    console.log(community_filter);
  };
  //공통 옵션 리스트
  const optList = [
    {value: '년', name: '연도별'},
    {value: '월', name: '월별'},
    {value: '일', name: '일별'},
  ];

  //qna 시작날짜 변경시 저장
  const handleStartQnaDateChange = (event) => {
    setStart_qnaDate(event.target.value);
  };
  //qna 끝날짜 변경시 저장
  const handleEndQnaDateChange = (event) => {
    setEnd_qnaDate(event.target.value);
  };

  //커뮤니티 시작날짜 변경시 저장
  const handleStartComDateChange = (event) => {
    setStart_comDate(event.target.value);
  };
  //커뮤니티 끝날짜 변경시 저장
  const handleEndComDateChange = (event) => {
    setEnd_comDate(event.target.value);
  };
    

  //에러, 필터 값 변경시마다 QnA데이터 input 재실행
  useEffect(() => {
    if (error) return;
    //월별 QNA 게시글 수
    axios.get(`http://localhost:9988/admin/qna_dashboard/${qna_filter}`)
      .then(response => {
        console.log(response.data);
        setInputQnaData(response.data);
        setError(false); // 성공 시 오류 상태 초기화
      })
      .catch(err => {
        console.error("검색 중 오류 발생:", err);
        setError(true); // 오류가 발생하면 상태 변경
      });
  }, [error, qna_filter]);

  //에러, 필터 값 변경시마다 커뮤니티 데이터 인풋 재실행
  useEffect(() => {
    if (error) return;
    //월별 QNA 게시글 수
    axios.get(`http://localhost:9988/admin/community_dashboard/${community_filter}`)
      .then(response => {
        console.log(response.data);
        setInputComData(response.data);
        setError(false); // 성공 시 오류 상태 초기화
      })
      .catch(err => {
        console.error("검색 중 오류 발생:", err);
        setError(true); // 오류가 발생하면 상태 변경
      });
  }, [error,community_filter]);

  //qna 날짜 검색 폼 submit event
  const handleQnADateSubmit=(e)=>{
    e.preventDefault(); 
    const startQ=new Date(start_qnaDate);
    const endQ=new Date(end_qnaDate);

    if(startQ>endQ){
      alert("시작일이 종료일 이후입니다.");
      return false;
    }

    console.log("시작일",startQ, "종료일",endQ);
    console.log("폼제출 시작일",start_qnaDate,"폼제출 종료일",end_qnaDate)

    const qnaFormData={
      'start_qnaDate':start_qnaDate,
      'end_qnaDate':end_qnaDate
    }
    console.log('form데이터 확인:',qnaFormData);

  axios.post('http://localhost:9988/admin/qna_searchChart/', qnaFormData,{

  })
    .then(response => {
      console.log(response.data);
      setInputS_qnaData(response.data);
      setError(false); // 성공 시 오류 상태 초기화
    })
    .catch(err => {
      console.error("검색 중 오류 발생:", err);
      setError(true); // 오류가 발생하면 상태 변경
    });
  }

//커뮤니티 날짜 검색 폼 submit event
const handleComDateSubmit=(e)=>{
  e.preventDefault(); 

  const startC=new Date(start_comDate);
  const endC=new Date(end_comDate);

  if(startC>endC){
    alert("시작일이 종료일 이후입니다.");
    return false;
  }

  console.log("시작일",startC, "종료일",endC);
  console.log("폼제출 시작일",start_comDate,"폼제출 종료일",end_comDate)

  const comFormData={
    'start_comDate':start_comDate,
    'end_comDate':end_comDate
  }
  console.log('form데이터 확인:',comFormData);

  axios.post('http://localhost:9988/admin/com_searchChart/', comFormData,{

  })
    .then(response => {
      console.log(response.data);
      setInputS_comData(response.data);
      setError(false); // 성공 시 오류 상태 초기화
    })
    .catch(err => {
      console.error("검색 중 오류 발생:", err);
      setError(true); // 오류가 발생하면 상태 변경
    });
}       
//QNA 챠트 설정
if(qna_filter ==="년"){
  //년도 정렬
  const sortedQnAData = inputQnaData.sort((a, b) => a.qna_date - b.qna_date);
  
  qnaData={
    labels: sortedQnAData.map(item=>item.qna_date),
    datasets:[
      {
         label:'Year',
         data: inputQnaData.map(item=>item.qna_count),
         backgroundColor:'rgb(122, 137, 245)',
       },
     ],
  };
}
  if (qna_filter === "월") {
    const allMonths = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dataByMonth = allMonths.map(month => {
      const foundData = inputQnaData.find(item => item.qna_date + "월" === month);
      return {
        month: month,
        qna_count: foundData ? foundData.qna_count : 0
      };
    });
    qnaData = {
      labels: dataByMonth.map(item => item.month),
      datasets: [
        {
          label: 'Month',
          data: dataByMonth.map(item => item.qna_count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }
  if(qna_filter ==="일"){
    qnaData={
      labels: inputQnaData.map(item=>item.qna_date),
      datasets:[
        {
          label:'Day',
          data:inputQnaData.map(item=>item.qna_count),
          backgroundColor:'rgb(184, 245, 122)',
        },
      ],
    };
  }//QNA 챠트 설정 if end

  //커뮤니티 챠트 설정 if
  if(community_filter ==="년"){
    //년도 정렬
    const sortedComData = inputComData.sort((a, b) => a.community_date - b.community_date);
    
    communityData={
      labels: sortedComData.map(item=>item.community_date),
      datasets:[
        {
           label:'Year',
           data: sortedComData.map(item=>item.community_count),
           backgroundColor:'rgb(122, 137, 245)',
         },
       ],
    };
  }
  if (community_filter === "월") {
    const allMonths = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dataByMonth = allMonths.map(month => {
      const foundData = inputComData.find(item => item.community_date + "월" === month);
      return {
        month: month,
        community_count: foundData ? foundData.community_count : 0
      };
    });
    communityData = {
      labels: dataByMonth.map(item => item.month),
      datasets: [
        {
          label: 'Month',
          data: dataByMonth.map(item => item.community_count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }
  if(community_filter ==="일"){
    communityData={
      labels: inputComData.map(item=>item.community_date),
      datasets:[
        {
          label:'Day',
          data:inputComData.map(item=>item.community_count),
          backgroundColor:'green',
        },
      ],
    };
  }//커뮤니케이션 if end

  //검색 Qna 챠트 데이타
  sQnaData={
    labels: inputS_qnaData.map(item=>item.qna_date),
    datasets:[
      {
        label: 'Day',
        data: inputS_qnaData.map(item => item.qna_count),
        fill: true, // 선 아래를 채우기 위해 true 설정
        backgroundColor: 'rgba(184, 245, 122, 0.5)', // 반투명 녹색
        borderColor: 'rgb(184, 245, 122)',
        tension: 0.1,
      },
    ],
  };
  //검색 커뮤니티 챠트 데이타
  sComData={
    labels: inputS_comData.map(item=>item.community_date),
    datasets:[
      {
        label: 'Day',
        data: inputS_comData.map(item => item.community_count),
        fill: true, // 선 아래를 채우기 위해 true 설정
        backgroundColor: 'rgba(122, 137, 245, 0.5)', // 반투명 빨간색
        borderColor: 'rgb(122, 137, 245)',
        tension: 0.1,
      },
    ],
  };

  //QNA챠트 옵션 설정
  const options = {
    animation:{
      duration:2000
    },
    maxBarThickness: 50,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
          ticks:{
            stepSize:2
          }
        }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: qna_filter === '월' ? '월별 qna 게시글 수' 
              : qna_filter === '년' ? '연도별 qna 게시글 수' 
              : qna_filter==='일' ? '일별 qna 게시글 수'
              : qna_filter==='',
      },
    },
  };

  //커뮤니케이션 챠트 옵션 설정
  const com_options = {
    animation:{
      duration:2000
    },
    scales: {
      y: {
          ticks:{
            stepSize:2
          }
        }
    },
    maxBarThickness: 50,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: community_filter === '월' ? '월별 커뮤니티 게시글 수' 
              : community_filter === '년' ? '연도별 커뮤니티 게시글 수' 
              : community_filter==='일' ? '일별 커뮤니티 게시글 수'
              : community_filter==='',
      },
    },
  };
  //검색 qna챠트 설정
  const s_Qoptions = {
    animation:{
      duration:2000
    },
    responsive: true,
    maintainAspectRatio: false,
    pointRadius:6,
    tension:0,
    scales: {
      y: {
        beginAtZero: true,
          ticks:{
            stepSize:2
          }
        },
      x:{
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: ''
      },
    },
  };
  // 검색 커뮤니티 챠트 설정
  const s_Coptions = {
    animation:{
      duration:2000
    },
    responsive: true,
    maintainAspectRatio: false,
    pointRadius:6,
    tension:0,
    scales: {
      y: {
        beginAtZero: true,
          ticks:{
            stepSize:2
          }
        },
      x:{
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: ''
      },
    },
  };


  return (
    <div className="adminBody">
      <h3 style={{ textAlign: "left" }}>Dashboard</h3>
      <div className="minDatas">
        <div className="minDataTitle">today's QnAs
          <div className="minDataBox">content</div>
        </div>
        <div className="minDataTitle">today's Communities
          <div className="minDataBox">content</div>
        </div>
        <div className="minDataTitle">today's subscribers
          <div className="minDataBox">content</div>
        </div>
        <div className="minDataTitle">today's Chats
          <div className="minDataBox">content</div>
        </div>
      </div>
      <div className="adminDashboard">
        {/* qna챠트 */}
        <div className='chartarea'>
          <div className="chartTop">
            문의 게시글 수 &nbsp;
            <select
              onChange={handleQnaFilterChange}
              value={qna_filter}
            >
              {optList.map((item) => {
                return <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              })}
            </select></div>
          <div className="chartBox">
            <Bar data={qnaData} options={options} minwidth="400px" height="300px" />
          </div>
        </div>
        {/* 커뮤니티 챠트 */}
        <div className='chartarea'>
          <div className="chartTop">
            커뮤니티 게시글 수 &nbsp;
            <select
              onChange={handleCommunityFilterChange}
              value={community_filter}
            >
              {optList.map((citem) => {
                return <option value={citem.value} key={citem.value}>
                  {citem.name}
                </option>
              })}
            </select></div>
          <div className="chartBox">
            <Bar data={communityData} options={com_options} width="300px" height="300px" />
          </div>
        </div>
        <div className='simpBoardArea'>
        <div className="simpBoardT">
            QnA 게시글
            <div className="simpBoardL">더보기▷</div>
          </div>
            <div className="container">
              <div className="row">
                <div className="col-sm-1">No</div>
                <div className="col-sm-6">제목</div>
                <div className="col-sm-2">등록일</div>
                <div className="col-sm-3">답변여부</div>
              </div>
            </div>
        </div>
        {/* 날짜 검색 qna 챠트 */}
        <div className='chartarea'>
          <form onSubmit={handleQnADateSubmit}>
            QNA 기간별 게시글 수<br />
            <input type="date"
              id="first-date"
              max="2099-12-31"
              min="1990-01-01"
              required pattern="\d{4}-\d{2}-\d{2}"
              value={start_qnaDate}
              onChange={handleStartQnaDateChange}
            />
            &nbsp;-&nbsp;
            <input type="date"
              id="last-date"
              max="2099-12-31"
              min="1990-01-01"
              required pattern="\d{4}-\d{2}-\d{2}"
              value={end_qnaDate}
              onChange={handleEndQnaDateChange}
            />
            <button>검색</button>
          </form>
          <div className="chartBox">
            <Line data={sQnaData} options={s_Qoptions} width="300px" height="300px" />
          </div>
        </div>
        {/* 날짜 검색 커뮤니티 챠트 */}
        <div className='chartarea'>
          <form onSubmit={handleComDateSubmit}>
            커뮤니티 기간별 게시글 수<br />
            <input type="date"
              id="first-date"
              max="2099-12-31"
              min="1990-01-01"
              required pattern="\d{4}-\d{2}-\d{2}"
              value={start_comDate}
              onChange={handleStartComDateChange}
            />
            &nbsp;-&nbsp;
            <input type="date"
              id="last-date"
              max="2099-12-31"
              min="1990-01-01"
              required pattern="\d{4}-\d{2}-\d{2}"
              value={end_comDate}
              onChange={handleEndComDateChange}
            />
            <button>검색</button>
          </form>
          <div className="chartBox">
            <Line data={sComData} options={s_Coptions} width="300px" height="300px" />
          </div>
        </div>
        <div className="simpBoardArea">
        <div className="simpBoardT">
            커뮤니티 게시글
            <div className="simpBoardL">더보기▷</div>
            </div>
              <div className="container">
                <div className="row">
                <div className="col-sm-1">No</div>
                <div className="col-sm-6">제목</div>
                <div className="col-sm-2">등록일</div>
                <div className="col-sm-3">조회수</div>
              </div>
            </div>
        </div>
      </div>
    </div>    
  );
}

export default AdminTest;