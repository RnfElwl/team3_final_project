import react, { useEffect,useState } from 'react';
// import '../App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import axios from "../../component/api/axiosApi";
import './../../css/admin/admin.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function AdminTest() {
  //DB 데이터
  const today = new Date();
  const todays_month=`${today.getMonth()+1}`;
  const [inputData, setInputData]=useState([]);
  const [qna_filter, setQna_filter]=useState('년');
  let data = {};
  const [qb_chartTitle, setQb_ChartTitle]=useState('');
  const [error, setError] = useState(false);
  
  //필터 옵션
  const handleQnaFilterChange = (e) => { //검색키 처리
    data={}
    setQna_filter(e.target.value);
    console.log(qna_filter);
    
  };

  const optList = [
    {value: '년', name: '년'},
    {value: '월', name: '월'},
    {value: '일', name: '일'},
  ];

  useEffect(() => {
    if (error) return;

    //월별 게시글 수
    axios.get(`http://localhost:9988/admin/qna_dashboard/${qna_filter}`)
      .then(response => {
        console.log(response.data);
        setInputData(response.data);
        setError(false); // 성공 시 오류 상태 초기화
      })
      .catch(err => {
        console.error("검색 중 오류 발생:", err);
        setError(true); // 오류가 발생하면 상태 변경
      });
  }, [error, qna_filter]);

  

  if (qna_filter === "월") {
    const allMonths = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dataByMonth = allMonths.map(month => {
      const foundData = inputData.find(item => item.qna_date + "월" === month);
      return {
        month: month,
        qna_count: foundData ? foundData.qna_count : 0
      };
    });
    data = {
      labels: dataByMonth.map(item => item.month),
      datasets: [
        {
          label: 'Writed',
          data: dataByMonth.map(item => item.qna_count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }
  if(qna_filter ==="년"){
    data={
      labels: inputData.map(item=>item.qna_date),
      datasets:[
        {
           label:'Writed',
           data: inputData.map(item=>item.qna_count),
           backgroundColor:'red',
         },
       ],
    };
  }
  if(qna_filter ==="일"){
    data={
      labels: inputData.map(item=>item.qna_date),
      datasets:[
        {
          label:'Writed',
          data:inputData.map(item=>item.qna_count),
          backgroundColor:'green',
        },
      ],
    };
  }

  const options = {
    animation:{
      duration:2000
    },
    maxBarThickness: 50,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: qna_filter === '월' ? '월별 qna 게시글 수' 
              : qna_filter === '년' ? '연도별 qna 게시글 수' 
              : qna_filter==='일' ? '일별 qna 게시글 수'
              : qna_filter==='',
      },
    },
  };

  return (
      <div className="adminBody">
        <p>관리자 페이지 테스트</p>
        <div className="adminDashboard">
          <div className='chartarea'>
            <div>
              필터값:&nbsp; 
            <select
              onChange={handleQnaFilterChange}
              value={qna_filter}
              >
              {optList.map((item)=>{
                return <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              })}
            </select></div>
            <Bar data={data} options={options} minwidth="400px" height="300px"/>
          </div>
          <div className='chartarea'>
            2
            {/* <Bar data={data} options={options} width="300px" height="300px" /> */}
          </div>
          <div className='chartarea'>
            3
            {/* <Bar data={data} options={options} width="300px" height="300px" /> */}
          </div>
        </div>
      </div>
    
  );
}

export default AdminTest;