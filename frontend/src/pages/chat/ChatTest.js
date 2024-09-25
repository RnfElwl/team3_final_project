import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as StompJs from '@stomp/stompjs';

function ChatTest() {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');

  const { chatlist_url } = useParams();
  const client = useRef({});

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://localhost:9988/ws',
      onConnect: () => {
        console.log('success');
        subscribe();
      },
    });
    client.current.activate();
  };

  const publish = (chat) => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        chatlist_url: 'chattest',
        chat_content: chat,
      }),
    });

    setChat('');
  };

  const subscribe = () => {
    client.current.subscribe('/sub/chat/' + chatlist_url, (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      setChatList((_chat_list) => [
        ..._chat_list, json_body
      ]);
    });
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleChange = (event) => { // 채팅 입력 시 state에 값 설정
    setChat(event.target.value);
  };

  const handleSubmit = (event, chat) => { // 보내기 버튼 눌렀을 때 publish
    event.preventDefault();

    publish(chat);
  };
  
  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  return (
    <div>
      <div className={'chat-list'}>{chatList.map(item=>{
        return(
            <div>
                {item.chat_content}
            </div>
        )
      })}</div>
      <form onSubmit={(event) => handleSubmit(event, chat)}>
        <div>
          <input type={'text'} name={'chatInput'} onChange={handleChange} value={chat} />
        </div>
        <input type={'submit'} value={'의견 보내기'} />
      </form>
    </div>
  );
}

export default ChatTest;