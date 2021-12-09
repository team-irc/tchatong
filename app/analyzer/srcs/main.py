import pymysql
import pandas as pd
from pymysql.cursors import Cursor
import os
import threading

def get_last_date_from_chatfire(cursor: Cursor) -> tuple:
	sql: str
	
	sql = 'select date from chatfire order by date desc LIMIT 1;'
	cursor.execute(sql)
	return cursor.fetchall()

def delete_last_chatfire(cursor: Cursor, res: tuple) -> tuple:
	sql: str

	sql = f"DELETE FROM chatlog WHERE (date = \'{res[0]['date']}\');"
	cursor.execute(sql)
	return cursor.fetchall()

def get_chatlog_after_last_date(cursor: Cursor, res: tuple) -> tuple:
	sql: str

	sql = f"select * from chatlog where (date >= \'{res[0]['date']}\');"
	cursor.execute(sql)
	return cursor.fetchall()

def save_chatfire_from_chatlog(cursor: Cursor, res: tuple):
	df: pd.DataFrame
	chatlog = pd.DataFrame
	chatfire = pd.DataFrame
	sql: str

	df = pd.DataFrame(res)
	chatlog = df.set_index('date', drop=True) # Change date column to index for resample
	chatfire = chatlog.groupby('streamer_id').resample('1T').count().content.reset_index(level=['streamer_id', 'date']).rename(columns = {'content': 'count'})
	sql = f"INSERT INTO chatfire VALUES(%s, %s, %s);"
	cursor.executemany(sql, chatfire.values.tolist())


def save_chatfire_from_last_date():
	res: tuple
	
	try:
		# chatfire에 마지막으로 기록된 시간 가져오기
		res = get_last_date_from_chatfire(cursor)
		# chatfire에 마지막으로 기록된 시간 row 지우기
		delete_last_chatfire(cursor, res)
		# 마지막 시간 이후의 chatlog 가져오기
		res = get_chatlog_after_last_date(cursor, res)
		# chatlog 에서 chatfire 파싱해서 집어넣기
		save_chatfire_from_chatlog(cursor, res)
		db.commit()
		threading.Timer(60, save_chatfire_from_last_date).start()

	except:
		print('[-] save_chatfire error')
		exit(1)

def	main():
	print("twitch-chat-analyzer start")
	global db
	db = pymysql.connect(
		user=os.getenv('DB_USER'),
		passwd=os.getenv('DB_PASSWORD'),
		host=os.getenv('DB_HOST'),
		db=os.getenv('DB_NAME'),
		charset='utf8'
	)
	global cursor 
	cursor = db.cursor(pymysql.cursors.DictCursor)

	# 1분당 채팅수 기록
	# chatfire ('streamer_id', 'date', 'count')
	# ---------
	# 1. 실시간 기록 (매 1분마다)
	# 2. 프로그램이 꺼져있던 시간동안 기록하지 못했던것 기록 (켜질때 한번만)
	# 	 - 중복 방지
	sql = "CREATE TABLE IF NOT EXISTS chatfire(\
					streamer_id VARCHAR(32) NOT NULL,\
					date TIMESTAMP NOT NULL,\
					count int);"
	cursor.execute(sql)
	cursor.fetchall()
	save_chatfire_from_last_date()

if __name__ == '__main__':
	main()
