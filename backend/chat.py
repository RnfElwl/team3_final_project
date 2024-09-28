from flask import Flask, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt

# Flask 애플리케이션 초기화
app = Flask(__name__)
CORS(app)  # 모든 출처에서 접근을 허용

# MQTT 브로커 정보
broker = 'localhost'  # 로컬에서 실행할 경우 localhost 사용
port = 1883           # MQTT 기본 포트
topic = 'test/topic'  # 사용할 주제

# MQTT 클라이언트 설정
mqtt_client = mqtt.Client()

# 브로커에 연결되면 호출되는 콜백 함수
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker with result code " + str(rc))
    client.subscribe(topic)  # 지정한 주제를 구독

# 메시지가 수신될 때 호출되는 콜백 함수
def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()}")  # 수신한 메시지 출력

# 콜백 함수 연결
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# 브로커에 연결
mqtt_client.connect(broker, port, 60)

# 클라이언트 루프 시작
mqtt_client.loop_start()

@app.route('/send_message/<message>', methods=['POST'])
def send_message(message):
    print(message)
    mqtt_client.publish(topic, message)
    return jsonify({'status': 'success', 'message': message}), 200

@app.route('/')
def index():
    return "MQTT Server is running..."

if __name__ == '__main__':
    try:
        print("Flask MQTT Server is running...")
        app.run(host='0.0.0.0', port=5000)  # Flask 애플리케이션 실행
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        mqtt_client.loop_stop()  # 루프 정지
        mqtt_client.disconnect()  # 브로커와의 연결 종료
