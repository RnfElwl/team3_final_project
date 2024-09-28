import paho.mqtt.client as mqtt

# MQTT 브로커 정보
broker = 'localhost'  # 또는 브로커의 IP 주소
port = 1883           # 또는 브로커의 포트

# MQTT 클라이언트 설정
client = mqtt.Client()

# 브로커에 연결 후 호출되는 콜백 함수
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe('chat/topic')  # 주제 구독

# 메시지가 수신될 때 호출되는 콜백 함수
def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()}")

# 콜백 함수 연결
client.on_connect = on_connect
client.on_message = on_message

# 브로커에 연결
try:
    client.connect(broker, port, 60)
except Exception as e:
    print(f"Connection failed: {e}")

# 클라이언트 루프 시작
client.loop_start()

print("MQTT Chat Server is running...")

try:
    while True:
        pass  # 서버는 계속 실행됩니다.

except KeyboardInterrupt:
    print("Exiting...")

finally:
    client.loop_stop()
    client.disconnect()
