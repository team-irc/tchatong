#pragma once

#include <iostream> // std::cout 정의
#include <string> // string 타입 정의
#include <sys/socket.h> // socket 함수 정의
#include <netinet/in.h> // sockaddr_in 구조체 정의
#include <arpa/inet.h> // inet_addr 함수 정의
#include <unistd.h> // write 함수 정의
#include <thread> // thread 사용
#include <stdio.h> // getline 함수
#include <sstream> // istringstream 타입
#include <cstdlib> // getenv 함수
#include <mysql.h> // mysql c++ connector
#include "IrcError.hpp"
#include "IrcSocket.hpp"
#include "mysql_driver.h" // MySQL_Driver
#include "mysql_connection.h" // Connection
#include "mysql_error.h" 
#include "cppconn/statement.h" // Statement

typedef struct	s_chat 
{
	std::string		channel;
	std::string		id;
	std::string		content;
}								t_chat;

class IrcClient 
{
private:
	IrcSocket				*_socket;
	sql::Connection	*_con;
	sql::Statement	*_stmt;
	
public:
	IrcClient();
	virtual ~IrcClient();
	IrcClient(const IrcClient &ref);
	IrcClient &operator=(const IrcClient &ref);
	
	void					send_to_server(const std::string &msg);
	void					recv_from_server();
	void					parse_chat(const std::string &msg);
	void					login_twitch();
	void					join_streamer_channels();

	void					connect_db();
	void					disconnect_db();
	void					init_db();
};
