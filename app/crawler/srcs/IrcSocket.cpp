#include "IrcSocket.hpp"

/*
	@brief create socket fd
*/
IrcSocket::IrcSocket() 
{
	_fd = socket(AF_INET, SOCK_STREAM, 0);
	if (_fd <= 0)
		throw (IrcError("socket create error"));	
}

IrcSocket::~IrcSocket() {}

/*
	@brief 트위치 irc서버 주소 설정
	@detail 보통 irc 포트는 6667로 고정되어 있는데, 
					ip주소같은 경우 dns를 ip로 resolve 해주는 과정이 필요하다.
					여기서는 그 과정이 생략되어있고, 나중에 연결 에러시 이 부분을 확인 해야 할 수도 있다.
*/
void		IrcSocket::set_twitch_irc_server_addr(struct sockaddr_in &twitch_server_addr)
{
	memset(&twitch_server_addr, 0, sizeof(twitch_server_addr));
	twitch_server_addr.sin_family = AF_INET;
	twitch_server_addr.sin_port = htons(TWITCH_IRC_PORT);
	twitch_server_addr.sin_addr.s_addr = inet_addr(TWITCH_IRC_IP);
}

/*
	@brief 트위치 irc서버 연결
*/
void		IrcSocket::connect_to_twitch_irc_server()
{
	int									connect_res;
	struct sockaddr_in	twitch_server_addr;

	set_twitch_irc_server_addr(twitch_server_addr);
	connect_res = ::connect(_fd, (struct sockaddr *)&twitch_server_addr, sizeof(twitch_server_addr));
	// return 이 올때까지 blocking 상태
	if (connect_res == -1)
		throw (IrcError("twitch server connect error"));
	std::cout << "socket connected" << std::endl;
}

/*
	@brief 트위치 서버로 메세지 전송
*/
void		IrcSocket::send_msg(const char *msg)
{
	int		send_res;

	send_res = ::send(_fd, msg, strlen(msg), 0);
	// std::cout << "SEND " << _fd << " " << msg << std::endl;
	if (send_res == SEND_ERROR)
		throw (IrcError("send return -1"));
}

/*
	@brief 트위치 서버에서 메세지 수신
*/
std::string		IrcSocket::recv_msg()
{
	int		ret;
	int		size;
	char	buffer[MAX_DATA_SIZE];

	memset(buffer, 0, MAX_DATA_SIZE);
	size = recv(_fd, buffer, MAX_DATA_SIZE - 1, 0);
	if (size > 0)
		return std::string(buffer);
	else if (size == 0)
		throw (IrcError("recv return 0"));
	else // (size < 0)
		throw (IrcError("recv error: " + std::to_string(size)));
}