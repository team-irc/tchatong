#include "IrcClient.hpp"
#include "IrcSocket.hpp"
#include "utils.hpp"

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

int		main()
{
	try
	{
		g_client = new IrcClient();
		g_client->login_twitch();
		g_client->join_streamer_channels();
		// announce();
		std::thread	thread(input_thread);
		thread.detach();
		while (true)
		{
			g_client->recv_from_server();
		}
	}
	catch (IrcError const &e)
	{
		std::cerr << e.what() << std::endl;
	}
	return 0;
}