import react, { useEffect,useState } from 'react';
// import '../App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
//npm install react-chartjs-2 chart.js
import axios from 'axios';
import './../../css/admin/admin.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function AdminTest() {
  //DB 데이터
  const [inputData, setInputData]=useState([])

  useEffect(()=>{
    const fetchData=async()=>{
    try{
      const res=await axios.get('http://localhost:9988/admin/dashboard');
      setInputData(res.data);
    }catch(e){
      console.log(e);
    }
  };
  fetchData();
  },[]);

  useEffect(()=>{
    console.log(inputData);
  },[inputData]);

  //http://localhost:9988/admin/dashboard
  const data = {
    labels: inputData.map(item=>item.season),
    datasets: [
      {
        label: 'Visited',
        data: inputData.map(item=>item.acount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '계절별 사이트 방문 수',
      },
    },
  };

  return (
      <div className="adminBody">
        <p>관리자 페이지 테스트</p>
        <container id='chartarea'>
          <Bar data={data} options={options} width="300px" height="300px" />
        </container>
      </div>
    
  );
}

export default AdminTest;