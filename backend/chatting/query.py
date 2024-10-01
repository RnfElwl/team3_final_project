import mysql.connector
from dotenv import load_dotenv
import os
from mysql.connector import Error
# MySQL 데이터베이스에 연결
db_user = os.getenv('DB_USERNAME')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_name = os.getenv('DB_NAME')

def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host='localhost',        # MySQL 서버 주소
            database='your_database', # 사용할 데이터베이스 이름
            user='your_username',     # MySQL 사용자 이름
            password='your_password'  # MySQL 사용자 비밀번호
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# 데이터베이스에서 데이터를 SELECT하는 함수
def select_query(connection):
    try:
        cursor = connection.cursor(dictionary=True)  # 딕셔너리 형태로 결과 반환
        query = "SELECT * FROM your_table"           # 사용할 SELECT 쿼리문
        cursor.execute(query)
        rows = cursor.fetchall()                     # 모든 결과를 가져옴
        for row in rows:
            print(row)                               # 결과 출력
    except Error as e:
        print(f"Error executing SELECT query: {e}")

# MySQL 연결 종료 함수
def close_connection(connection):
    if connection.is_connected():
        connection.close()
        print("MySQL connection is closed")
