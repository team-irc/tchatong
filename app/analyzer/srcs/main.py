# -*- coding: utf-8 -*-
import pymysql
import pandas as pd
from pymysql.cursors import Cursor
import time
import os
import threading

def get_last_date_from_chatfire(cursor: Cursor) -> tuple:
	sql: str
	
	sql = 'select date from chatfire order by date desc LIMIT 1;'
	cursor.execute(sql)
	return cursor.fetchall()

def delete_last_chatfire(cursor: Cursor, res: tuple):
	sql: str

	sql = f"DELETE FROM chatlog WHERE (date = \'{res[0]['date']}\');"
	print("DELETE SQL: ", sql)
	cursor.execute(sql)
	db.commit()
	return 

def get_chatlog_after_last_date(cursor: Cursor, res: tuple) -> tuple:
	sql: str

	sql = f"select * from chatlog where (date >= \'{res[0]['date']}\');"
	cursor.execute(sql)
	res = cursor.fetchall()
	print(res)
	print(type(res))
	print('get_chatlog end')
	return res

def save_chatfire_from_chatlog(cursor: Cursor, res3: tuple):
	df: pd.DataFrame
	chatlog: pd.DataFrame
	chatfire: pd.DataFrame
	sql: str

	print('save_chatfire_from_chatlog in')
	print('res')
	# print(res)
	df = pd.DataFrame(res3)
	chatlog = df.set_index('date', drop=True) # Change date column to index for resample
	chatfire = chatlog.groupby('streamer_id').resample('1T').count().content.reset_index(level=['streamer_id', 'date']).rename(columns = {'content': 'count'})
	print('chatfire')
	print(chatfire)
	sql = f"INSERT INTO chatfire VALUES(default, %s, %s, %s);"
	cursor.executemany(sql, chatfire.values.tolist())


def save_chatfire_from_last_date():
	try:
		print('while in')
		res = get_last_date_from_chatfire(cursor)
		print('get last date', res)
		if (res):
			delete_last_chatfire(cursor, res)
			res = get_chatlog_after_last_date(cursor, res)
			print('chatlog after last date')
			if (res):
				print('if in')
				save_chatfire_from_chatlog(cursor, res)
				db.commit()
				print("db commit success")
		else:
			print('else in')
			sql = f"select * from chatlog;"
			cursor.execute(sql)
			print("execute success")
			res2 = cursor.fetchmany(100)
			while (res2):
				print("fetch sucess")
				save_chatfire_from_chatlog(cursor, res2)
				db.commit()
				print('commit success')
				res2 = cursor.fetchmany(100)

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
		charset='utf8mb4'
	)
	print("db connected.")
	global cursor 
	cursor = db.cursor(pymysql.cursors.DictCursor)
	print("cursor created")

	# 1분당 채팅수 기록
	# chatfire ('streamer_id', 'date', 'count')
	# ---------
	# 1. 실시간 기록 (매 1분마다)
	# 2. 프로그램이 꺼져있던 시간동안 기록하지 못했던것 기록 (켜질때 한번만)
	# 	 - 중복 방지
	while (True):
		save_chatfire_from_last_date()
		time.sleep(60)

if __name__ == '__main__':
	main()
