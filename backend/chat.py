import paho.mqtt.client as mqtt

# MQTT 브로커 정보
broker = 'localhost'
port = 1883
username = '1234'  # 위에서 설정한 사용자 이름
password = '1234'    # 위에서 설정한 비밀번호
topic = 'chat/topic'

# MQTT 클라이언트 설정
client = mqtt.Client()

# 사용자 인증 정보 설정
client.username_pw_set(username, password)

# 브로커에 연결 후 호출되는 콜백 함수
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(topic)

# 메시지가 수신될 때 호출되는 콜백 함수
def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()}")

# 콜백 함수 연결
client.on_connect = on_connect
client.on_message = on_message

# 브로커에 연결
client.connect(broker, port, 60)

# 클라이언트 루프 시작
client.loop_start()

try:
    while True:
        message = input("Enter a message to send (or 'exit' to quit): ")
        if message.lower() == 'exit':
            break
        client.publish(topic, message)

except KeyboardInterrupt:
    print("Exiting...")

finally:
    client.loop_stop()
    client.disconnect()
