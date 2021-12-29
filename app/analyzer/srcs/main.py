# -*- coding: utf-8 -*-
import pymysql
import pandas as pd
from pymysql.cursors import Cursor
import time
import os
import threading
import datetime
import konlpy

DB_CONNECTION_RETRY_PERIOD: int = 10
CHATFIRE_UPDATE_PERIOD: int = 30

def get_last_date_from_chatfire(cursor: Cursor) -> tuple:
	sql: str
	
	sql = 'select date from chatfire order by date desc LIMIT 1;'
	cursor.execute(sql)
	return cursor.fetchall()

def delete_last_chatfire(cursor: Cursor, res):
	sql: str

	sql = f"DELETE FROM chatfire WHERE (date = \'{res[0]['date']}\');"
	# print("DELETE SQL:", sql)
	cursor.execute(sql)
	# print("commit start")
	db.commit()
	return 

def get_chatlog_after_last_date(cursor: Cursor, res) -> tuple:
	sql: str

	# print("get_chatlog_after_last_date start")
	# print(res)
	sql = f"select * from chatlog where (date >= \'{res[0]['date']}\');"
	# print("execute sql")
	cursor.execute(sql)
	# print("fetchall")
	res = cursor.fetchall()
	# print('get_chatlog end')
	return res

def save_chatfire_from_chatlog(cursor: Cursor, res3: tuple):
	df: pd.DataFrame
	chatlog: pd.DataFrame
	chatfire: pd.DataFrame
	sql: str

	# print('save_chatfire_from_chatlog in')
	# print('res')
	# print(res)
	df = pd.DataFrame(res3)
	chatlog = df.set_index('date', drop=True) # Change date column to index for resample
	chatfire = chatlog.groupby('streamer_id').resample('1T').count().content.reset_index(level=['streamer_id', 'date']).rename(columns = {'content': 'count'})
	# print('chatfire')
	# print(chatfire)
	sql = f"INSERT INTO chatfire VALUES(default, %s, %s, %s);"
	# print('execuetmany start')
	cursor.executemany(sql, chatfire.values.tolist())
	# print('db commit start')
	db.commit()
	# print("db commit success")

def save_chatfire_from_last_date():
	try:
		# print('while in')
		res = get_last_date_from_chatfire(cursor)
		# print('get last date', res)
		if (res):
			delete_last_chatfire(cursor, res)
			res = get_chatlog_after_last_date(cursor, res)
			# print('chatlog after last date')
			if (res):
				# print('if in')
				save_chatfire_from_chatlog(cursor, res)
		else:
			# print('else in')
			sql = f"select * from chatlog;"
			cursor.execute(sql)
			# print("execute success")
			res2 = cursor.fetchmany(100)
			while (res2):
				# print("fetch sucess")
				save_chatfire_from_chatlog(cursor, res2)
				res2 = cursor.fetchmany(100)

	except:
		# print('[-] save_chatfire error')
		exit(1)

def save_topword_in_a_day(streamer_id, db, cursor):
	a_day_ago: datetime.datetime

	a_day_ago = datetime.datetime.now() - datetime.timedelta(days=1)
	sql = f"SELECT content FROM chatlog WHERE (streamer_id = '{streamer_id}' AND date >= \'{a_day_ago}\');"
	fetch_num = cursor.execute(sql)
	if (fetch_num < 100 | fetch_num > 10000):
		return
	chatlogs_for_a_day = cursor.fetchall()
	okt = konlpy.tag.Okt()
	result = {}
	for chatlog in chatlogs_for_a_day:
		malist = okt.pos(chatlog['content'], norm=True, stem=True)
		for mal in malist:
			if mal[1] in ["Noun"]:
				word = mal[0]
				if word in result.keys():
					result[word] += 1
				else:
					result[word] = 1
			if mal[1] not in ["Josa", "Eomi", "Puntuation"]:
				word = mal[0]
				if word in result.keys():
					result[word] += 1
				else:
					result[word] = 1
	res = sorted(result.items(), key=lambda x: x[1])
	if (len(res) > 10):
		try:
			sql = f"INSERT INTO topword VALUES (default, \'{streamer_id}\', \'{datetime.datetime.now()}\', \'{res[-1][0]}\', \'{res[-2][0]}\', \'{res[-3][0]}\', \'{res[-4][0]}\', \'{res[-5][0]}\', \'{res[-6][0]}\', \'{res[-7][0]}\', \'{res[-8][0]}\', \'{res[-9][0]}\', \'{res[-10][0]}\')"
			cursor.execute(sql)
			db.commit()
		except:
			return


def refresh_topwards(db, cursor):
	sql = "SELECT streamer_id FROM streamer;"
	cursor.execute(sql)
	streamers = cursor.fetchall()
	for streamer in streamers:
		save_topword_in_a_day(streamer['streamer_id'], db, cursor)

def refresh_topwards_thread_func(db, cursor):
	while True:
		refresh_topwards(db, cursor)
		time.sleep(3600)

def connect_db():
	global db
	global cursor 
	try:
		db = pymysql.connect(
			user=os.getenv('DB_USER'),
			passwd=os.getenv('DB_PASSWORD'),
			host=os.getenv('DB_HOST'),
			db=os.getenv('DB_NAME'),
			charset='utf8mb4'
		)
		print("db connected")
		cursor = db.cursor(pymysql.cursors.DictCursor)
		# print("cursor created")
	except:
		print("[-] RETRY DB CONNECTION...")
		time.sleep(DB_CONNECTION_RETRY_PERIOD)
		connect_db()

def	main():
	# print("twitch-chat-analyzer start")

	connect_db()

	# 1분당 채팅수 기록
	# chatfire ('streamer_id', 'date', 'count')
	# ---------
	# 1. 실시간 기록 (매 1분마다)
	# 2. 프로그램이 꺼져있던 시간동안 기록하지 못했던것 기록 (켜질때 한번만)
	# 	 - 중복 방지
	# t1 = threading.Thread(target=refresh_topwards_thread_func, args=(db, cursor))
	# t1.start()
	refresh_topwards(db, cursor)
	while (True):
		save_chatfire_from_last_date()
		time.sleep(CHATFIRE_UPDATE_PERIOD)

if __name__ == '__main__':
	main()
