#pragma once

#include "IrcError.hpp"
#include <sys/socket.h> // socket 함수 정의
#include <netinet/in.h> // sockaddr_in 구조체 정의
#include <arpa/inet.h> // inet_addr 함수 정의
#include <unistd.h> // write 함수 정의
#include <string.h>
#include <iostream>
#include <thread>

#define TWITCH_IRC_PORT 6667
#define TWITCH_IRC_URL "irc.chat.twitch.tv" // resolve 필요
#define TWITCH_IRC_IP "34.217.198.238"
#define MAX_DATA_SIZE 1024

class IrcSocket
{
private:
	int		_fd;

public:
	IrcSocket();
	virtual ~IrcSocket();
	
	void					set_twitch_irc_server_addr(struct sockaddr_in &twitch_server_addr);
	void					connect_to_twitch_irc_server();
	void					send_msg(const char *msg);
	std::string		recv_msg();
};