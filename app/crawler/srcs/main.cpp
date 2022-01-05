#include "IrcClient.hpp"
#include "IrcSocket.hpp"
#include "utils.hpp"

#define LOGGING_INTERVAL 60
IrcClient		*g_client; // 입력용 thread와 공유할 변수

void	announce()
{
	std::cout << "채널 참여: join #twitch_id" << std::endl;
	std::cout << "채널 나가기: part #twitch_id" << std::endl;
}

void	input_thread()
{
	std::string		msg;

	while (true)
	{
		getline(std::cin, msg);
		if (msg == "")
			continue;
		if (msg == "quit" || msg == "exit")
			exit(0);
		if (msg == "help")
			announce();
		g_client->send_to_server(msg);
	}
}

void	log_current_time()
{
	std::time_t t = std::time(0);   // get time now
	std::tm* now = std::localtime(&t);
	std::cout << '[' << (now->tm_year + 1900) << '-' 
				<< (now->tm_mon + 1) << '-'
				<< now->tm_mday << ' '
				<< now->tm_hour << ':'
				<< now->tm_min << ':'
				<< now->tm_sec << ']';
}

void	log_parse_chat_counter()
{
	g_client->parse_chat("", true);
}

void	logging_thread()
{
	std::string		log;

	while (true)
	{
		log_current_time();
		log_parse_chat_counter();
		sleep(LOGGING_INTERVAL);
	}
}

int		main()
{
	try
	{
		g_client = new IrcClient();
		g_client->login_twitch();
		g_client->join_streamer_channels();
		// announce();
		std::thread	thread(input_thread);
		std::thread thread2(logging_thread);
		thread.detach();
		thread2.detach();
		while (true)
		{
			try 
			{
				g_client->recv_from_server();
			} 
			catch (SocketDisconnectError const &e)
			{
				std::cout << "socket connection closed. (recv return 0)" << std::endl;
				std::cout << "try socket reconnect. after 30seconds " << std::endl;
				sleep(30);
				delete g_client;
				g_client = new IrcClient();
				g_client->login_twitch();
				g_client->join_streamer_channels();
			}
		}
	}
	catch (IrcError const &e)
	{
		std::cerr << e.what() << std::endl;
	}
	delete g_client;
	return 0;
}