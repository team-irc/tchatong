# -*- coding: utf-8 -*-
import pymysql
import pandas as pd
from pymysql.cursors import Cursor
import redis
import time
import os
import threading
import datetime
import konlpy

DB_CONNECTION_RETRY_PERIOD: int = 10



# TOPWORD를 계산하기 위해서 하루동안 쌓여있는 데이터가 이 구간 내에 있어야한다.
# 너무 많으면 메모리 부족, 너무 적으면 TOP10 통계를 낼 수 없다.
TOPWORD_FETCH_MIN = 100
TOPWORD_FETCH_MAX = 10000
CHATFIRE_UPDATE_PERIOD: int = 30
# TOPWORD가 1일마다 갱신되도록
TOPWORD_REFRESH_PERIOD = 2880 # 분당 2씩 증가 => 2 * 60(1시간) * 24(1일) = 2880
CHATLOG_DELETE_PERIOD = 5760


def get_last_date_from_chatfire(cursor: Cursor) -> tuple:
	sql: str
	
	sql = 'SELECT date FROM chatfire ORDER BY date DESC LIMIT 1;'
	cursor.execute(sql)
	return cursor.fetchall()

def delete_last_chatfire(cursor: Cursor, res):
	sql: str

	sql = f"DELETE FROM chatfire WHERE (date = \'{res[0]['date']}\');"
	cursor.execute(sql)
	db.commit()
	return 

def get_chatlog_after_last_date(cursor: Cursor, res) -> tuple:
	sql: str

	sql = f"SELECT * FROM chatlog WHERE (date >= \'{res[0]['date']}\');"
	cursor.execute(sql)
	res = cursor.fetchall()
	return res

def save_chatfire_from_chatlog(cursor: Cursor, res3: tuple):
	global rd
	df: pd.DataFrame
	chatlog: pd.DataFrame
	chatfire: pd.DataFrame
	sql: str

	df = pd.DataFrame(res3)
	chatlog = df.set_index('date', drop=True) # Change date column to index for resample
	chatfire = chatlog.groupby('streamer_id').resample('1T').count().content.reset_index(level=['streamer_id', 'date']).rename(columns = {'content': 'count'})
	chatfire['viewers'] = [rd.get(f"streamer:viewers:{streamer_id}") for streamer_id in chatfire['streamer_id'].tolist()]
	sql = f"INSERT INTO chatfire VALUES(default, %s, %s, %s, %s);"

	cursor.executemany(sql, chatfire.values.tolist())
	db.commit()

def save_chatfire_from_last_date():
	try:
		print('save chatfire')
		res = get_last_date_from_chatfire(cursor)
		if (res):
			delete_last_chatfire(cursor, res)
			res = get_chatlog_after_last_date(cursor, res)
			if (res):
				save_chatfire_from_chatlog(cursor, res)
		else:
			sql = f"select * from chatlog;"
			cursor.execute(sql)
			res2 = cursor.fetchmany(100)
			while (res2):
				save_chatfire_from_chatlog(cursor, res2)
				res2 = cursor.fetchmany(100)

	except Exception as e:
		print('[-] save_chatfire error')
		print(e)
		exit(1)

def save_topword_in_a_day(streamer_id, db, cursor):
	a_day_ago: datetime.datetime

	a_day_ago = datetime.datetime.now() - datetime.timedelta(days=1)
	sql = f"SELECT content FROM chatlog WHERE (streamer_id='{streamer_id}' AND date >= '{a_day_ago}')"
	fetch_num = cursor.execute(sql)
	if (fetch_num < TOPWORD_FETCH_MIN | fetch_num > TOPWORD_FETCH_MAX):
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
			if mal[1] not in ["Josa", "Eomi", "Punctuation"]:
				word = mal[0]
				if word in result.keys():
					result[word] += 1
				else:
					result[word] = 1
	res = sorted(result.items(), key=lambda x: x[1])
	if (len(res) > 10):
		try:
			sql = f"INSERT INTO topword VALUES (default, '{streamer_id}', '{datetime.datetime.now()}', '{res[-1][0]}', '{res[-2][0]}', '{res[-3][0]}', '{res[-4][0]}', '{res[-5][0]}', '{res[-6][0]}', '{res[-7][0]}', '{res[-8][0]}', '{res[-9][0]}', '{res[-10][0]}')"
			cursor.execute(sql)
			db.commit()
		except:
			return


def refresh_topwords(db, cursor):
	print('refresh topwords')
	sql = "SELECT streamer_id FROM streamer;"
	cursor.execute(sql)
	streamers = cursor.fetchall()
	for streamer in streamers:
		save_topword_in_a_day(streamer['streamer_id'], db, cursor)

def refresh_topwords_thread_func(db, cursor):
	while True:
		refresh_topwords(db, cursor)
		time.sleep(TOPWORD_REFRESH_PERIOD)

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
	
	except:
		print("[-] RETRY DB CONNECTION...")
		time.sleep(DB_CONNECTION_RETRY_PERIOD)
		connect_db()

def connect_redis():
	global rd
	rd = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=0, charset="utf-8", decode_responses=True)

def delete_chatlog(db, cursor):
	two_day_ago = datetime.datetime.now() - datetime.timedelta(days=2)
	sql = f"DELETE FROM chatlog WHERE date <= \'{two_day_ago}\';"
	cursor.execute(sql)
	db.commit()

# 1분당 채팅수 기록
# chatfire ('streamer_id', 'date', 'count')
# ---------
# 1. 실시간 기록 (매 1분마다)
# 2. 프로그램이 꺼져있던 시간동안 기록하지 못했던것 기록 (켜질때 한번만)
# 	 - 중복 방지
def	main():
	connect_db()
	connect_redis()
	# t1 = threading.Thread(target=refresh_topwords_thread_func, args=(db, cursor))
	# t1.start()
	refresh_topwords(db, cursor)
	refresh_topword_counter = 0
	delete_chatlog_counter = 0
	while (True):
		save_chatfire_from_last_date()
		time.sleep(CHATFIRE_UPDATE_PERIOD)
		refresh_topword_counter += 1
		delete_chatlog_counter += 1
		if (refresh_topword_counter > TOPWORD_REFRESH_PERIOD): #이 부분이 실행되는 동안 chatfire가 갱신되지 않는 문제는 어떻게 해결?? -> refresh_topwords 함수를 비동기로 바꾸던가 해야할듯
			refresh_topwords(db, cursor)
			refresh_topword_counter = 0
		if (delete_chatlog_counter > CHATLOG_DELETE_PERIOD):
			delete_chatlog(db, cursor)
			delete_chatlog_counter = 0

if __name__ == '__main__':
	main()
