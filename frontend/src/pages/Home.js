import react, { useState } from 'react';
import '../App.css';

import axios from 'axios';
function Home() {

  const [user, setUser] = useState({});
  const [bbs, setBbs] = useState({});
  // 밑에 있는게 input값 받아서 그걸 원하는거 하나씩 들고 올 수 있게 세팅하는거
  /*const [input_a, setInput] = useState('');
  const onChange = (e) =>{
    setInput(e.target.value);
  }*/
  function getUsername() {
    // 비동기식으로 node서버에 접속하여 이름 받아오기
    // 노드 서버에 접속
    axios.get('http://127.0.0.1:20000/username?userid=goguma1234')
    // input값을 들고와서 함 위는 userid가 고정값이고 밑은 입력값에 따라 달라짐
    // axios.get('http://127.0.0.1:20000/username?userid='+input_a)
    .then(function(response){
      console.log(response.data);
      // setUser(response.data[0].username);  // 가져온 데이터중 0번째 데이터의 유저이름을 들고옴
      setUser(response.data[0]);
    })
    .catch(function(error){
      console.log(error);
    });

  }
  function getBbs(){
    // 번호를 노드서버로 보내 해당글을 가져오기
    // axios.post('Port번호/node에서 받을주소', ,{json 데이터})
    axios.get('http://127.0.0.1:9988/user/view', {
      params:{
        no : 7
      }
      // news_no:3
      // 밑은 input_a에 따른 글이 다르게 출력 위는 3번으로 고정하고 가는거
      // news_no : input_a
    })
    .then(function(response){
      console.log(response.data);
      setBbs(response.data);
      console.log(bbs);
    })
    .catch(function(e){
      console.log(e);
    });
  }

  return (
      <div>
        <p>hi</p>
        <input type="button" value="post()으로 서버에 접속하여 제목, 글내용 얻어오기" onClick={getBbs} />
      </div>
    
  );
}

export default Home;