from flask import Flask, request, jsonify
import paho.mqtt.client as mqtt
import json
from query import connect_to_database, close_connection, insert_chat
from mysql.connector import Error
app = Flask(__name__)
#cd ../../Program Files/mosquitto
#mosquitto -c mosquitto.conf -v
# 데이터베이스에 메시지 저장 함수
def save_message_to_db(content_id, room_id, userid, msg, date):
    try:
        con = connect_to_database()
        cursor = con.cursor()
        insert_chat(con,content_id, room_id, userid, msg, date)
        cursor.close()
        close_connection(con)
    except Error as e:
        print(f"Error: {e}")
        return None


    print("db 메시지 추가 로직")

# 메시지를 수신하는 MQTT 클라이언트 설정
def on_message(client, userdata, msg):
    message_payload = msg.payload.decode()
    print(f"Received message: {message_payload}")
    data = json.loads(message_payload)

    if(data['chat_type']==1):
        content_id = data['content_id']
        chat_date = data['chat_date']
        room_id = data['chatlist_url']
        userid = data['userid']
        msg = data['chat_content']
        save_message_to_db(content_id, room_id, userid, msg, chat_date)

# Flask API - 메시지 처리 및 DB 저장
@app.route('/api/send_message', methods=['POST'])
def send_message():
    data = request.get_json()
    room_id = data['room']
    user = data['user']
    message = data['msg']
    
    # MQTT로 메시지 발행
    #mqtt_client.publish(f"test/topic/{room_id}", message)
    
    # DB에 메시지 저장
    save_message_to_db(room_id, user, message)
    
    return jsonify({'status': 'success', 'message': message}), 200

if __name__ == '__main__':
    mqtt_client = mqtt.Client()
    mqtt_client.on_message = on_message
    mqtt_client.connect('192.168.1.87', 1883, 60)
    mqtt_client.subscribe('test/topic/#')  # 모든 방의 메시지 수신
    
    mqtt_client.loop_start()
    
    print("Flask app is running...")
    app.run(host='0.0.0.0', port=5000)