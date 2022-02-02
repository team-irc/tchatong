#include "IrcClient.hpp"
#include "utils.hpp"

std::string replace_all(std::string str, const std::string& from, const std::string& to) {
	size_t start_pos = 0;
	while((start_pos = str.find(from, start_pos)) != std::string::npos) {
		str.replace(start_pos, from.length(), to);
		start_pos += to.length(); // Handles case where 'to' is a substring of 'from'
	}
	return str;
}

std::string	replace_special_characters(std::string const &str)
{
	std::string		ret;

	ret = replace_all(str, "\\", "\\\\"); // 백슬래시를 치환 하는 부분이 가장 먼저 이뤄져야한다.
	ret = replace_all(ret, "'", "\\'");
	ret = replace_all(ret, "\"", "\\\"");
	return (ret);
}

void		IrcClient::connect_db()
{
	try
	{
		sql::mysql::MySQL_Driver *driver;
		const char	*DB_HOST = std::getenv("DB_HOST");
		const char	*DB_USER = std::getenv("DB_USER");
		const char	*DB_PASS = std::getenv("DB_PASSWORD");
		const char	*DB_NAME = std::getenv("DB_NAME");

		driver = sql::mysql::get_mysql_driver_instance();
		_con = driver->connect("db:3306", DB_USER, DB_PASS);
		_stmt = _con->createStatement();
	}
	catch (sql::SQLException const &e)
	{
		std::cout << "[-] " << e.what() << std::endl;
		std::cout << "Retry db connect" << std::endl;
		sleep(RETRY_DB_CONNECTION_PERIOD);
		connect_db();
	}
}

void		IrcClient::init_db()
{
	_stmt->execute("USE twchat;");
	_stmt->execute("INSERT IGNORE INTO streamer VALUES  (default, '', 'zilioner', '침착맨', 'https://static-cdn.jtvnw.net/jtv_user_pictures/89e29e2e-f165-40e6-bc0c-d42205935216-profile_image-70x70.png'), \
														(default, '', 'handongsuk', '한동숙', 'https://static-cdn.jtvnw.net/jtv_user_pictures/c5a2baa2-74ed-4b72-b047-8326572c9bfa-profile_image-70x70.png'), \
														(default, '', 'runner0608', '러너교', 'https://static-cdn.jtvnw.net/jtv_user_pictures/e5da145b-14f7-4555-a550-5d5c9a1d96cf-profile_image-70x70.png'), \
														(default, '', 'cherrypach', '꽃핀', 'https://static-cdn.jtvnw.net/jtv_user_pictures/45059e9b-4b1e-4387-ba14-9a78477e6ca9-profile_image-70x70.png'), \
														(default, '', 'pacific8815', '쌍베', 'https://static-cdn.jtvnw.net/jtv_user_pictures/481c81b7-573b-4d8e-a06e-2b5b91464e56-profile_image-70x70.jpg'), \
														(default, '', '109ace', '철면수심', 'https://static-cdn.jtvnw.net/jtv_user_pictures/109ace-profile_image-579a869e5635763f-70x70.png'), \
														(default, '', 'ronaronakr', '로나로나땅', 'https://static-cdn.jtvnw.net/jtv_user_pictures/51c7790b-6dbf-4544-b765-7707430cdaed-profile_image-150x150.png'), \
														(default, '', 'woowakgood', '우왁굳', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ebc60c08-721b-4572-8f51-8be7136a0c96-profile_image-150x150.png'), \
														(default, '', 'cotton__123', '주르르', 'https://static-cdn.jtvnw.net/jtv_user_pictures/11f9c14e-342f-4ee6-b234-85cd77e45bc3-profile_image-70x70.png'), \
														(default, '', 'gosegugosegu', '고세구', 'https://static-cdn.jtvnw.net/jtv_user_pictures/a7962a5e-3d39-4257-913b-fec5f21dcf26-profile_image-150x150.png'), \
														(default, '', 'viichan6', '비챤', 'https://static-cdn.jtvnw.net/jtv_user_pictures/43f92c59-2457-4398-b4ea-26733f8c0695-profile_image-70x70.png'), \
														(default, '', 'lilpaaaaaa', '릴파', 'https://static-cdn.jtvnw.net/jtv_user_pictures/328aa19f-3d07-4bee-8dee-3fa61a93be12-profile_image-150x150.png'), \
														(default, '', 'jingburger', '징버거', 'https://static-cdn.jtvnw.net/jtv_user_pictures/1d981e78-e882-46f5-a3ea-77699c6c05bd-profile_image-70x70.png'), \
														(default, '', 'vo_ine', '아이네', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ec6626e2-657a-4762-b348-d972748aa58a-profile_image-150x150.png'), \
														(default, '', 'torona1', '슈카월드', 'https://static-cdn.jtvnw.net/jtv_user_pictures/efa02ddd-0973-491c-b69e-3158966f956b-profile_image-150x150.jpg'), \
														(default, '', 'aba4647', '랄로', 'https://static-cdn.jtvnw.net/jtv_user_pictures/e85f1e19-e793-4a07-bbc5-5135981dc4f8-profile_image-70x70.png'), \
														(default, '', 'hanryang1125', '풍월량', 'https://static-cdn.jtvnw.net/jtv_user_pictures/hanryang1125-profile_image-58261d78af47d249-70x70.jpeg'), \
														(default, '', 'saddummy', '서새봄냥', 'https://static-cdn.jtvnw.net/jtv_user_pictures/saddummy-profile_image-925b92caa01026ae-70x70.jpeg'), \
														(default, '', 'naseongkim', '김나성', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ea777be2-7415-4ef2-8512-20083e08e9db-profile_image-70x70.png'), \
														(default, '', 'nokduro', '녹두로', 'https://static-cdn.jtvnw.net/jtv_user_pictures/9c692e90-6f4f-4585-a3f3-f8610dfbf237-profile_image-70x70.png'), \
														(default, '', 'kanetv8', '케인', 'https://static-cdn.jtvnw.net/jtv_user_pictures/kanetv8-profile_image-9e346fec55dc4c49-70x70.jpeg'), \
														(default, '', 'paka9999', '파카', 'https://static-cdn.jtvnw.net/jtv_user_pictures/98bb53c3-4e2f-47f3-9c4b-6c0484b383f6-profile_image-70x70.png'), \
														(default, '', 'dopa24', '도파', 'https://static-cdn.jtvnw.net/jtv_user_pictures/4a35691a-b2af-40f8-af90-72cc31d295d6-profile_image-70x70.png'), \
														(default, '', 'tmxk319', '괴물쥐', 'https://static-cdn.jtvnw.net/jtv_user_pictures/59b10cc7-772e-48a9-92df-066e9a35862b-profile_image-70x70.jpg'), \
														(default, '', 'xkwhd', '피닉스박', 'https://static-cdn.jtvnw.net/jtv_user_pictures/00d773d6-0c5c-443a-947a-f3d765b95b4e-profile_image-70x70.jpg'), \
														(default, '', 'lovelyyeon', '연두부', 'https://static-cdn.jtvnw.net/jtv_user_pictures/32077614-02cc-4a0e-b79e-3f2dc26d7ace-profile_image-70x70.png'), \
														(default, '', 'zoodasa', '주다사', 'https://static-cdn.jtvnw.net/jtv_user_pictures/78858c8b-fcd5-4b76-9a91-cb89a15389f7-profile_image-150x150.png')");
}
/*
	@brief connect to twitch server socket when construct client
*/
IrcClient::IrcClient()
{
	char	sql[1024];

	_socket = new IrcSocket();
	this->connect_db();
	this->init_db();
	std::cout << "IRC Client Constructed." << std::endl;
}

void		IrcClient::disconnect_db()
{
	delete _stmt;
	delete _con;
}

IrcClient::~IrcClient()
{
	disconnect_db();
	std::cout << "IRC Client Destructed." << std::endl;
}

/*
	@brief 스트리머들 채텅 서버에 접속
*/
void	IrcClient::join_streamer_channels()
{
	std::cout << "joining streamer channels" << std::endl;
	sql::ResultSet  *res;
	int							req_limit_count;

	res = _stmt->executeQuery("SELECT streamer_login FROM streamer;");
	req_limit_count = 0;
	while (res->next())
	{
		if (req_limit_count > 15) {
			sleep(10);
			req_limit_count = 0;
		}
		// std::cout << "JOIN #" << res->getString("streamer_login") << std::endl;
		send_to_server("JOIN #" + res->getString("streamer_login"));
		req_limit_count++;
	}
}

/*
	@brief 트위치 계정으로 채팅 서버에 로그인
*/
void	IrcClient::login_twitch()
{
	std::cout << "login to twitch irc server..." << std::endl;
	std::string	id;
	std::string	code;

	id = std::getenv("TWITCH_ID");
	code = std::getenv("TWITCH_PW");

	_socket->connect_to_twitch_irc_server();
	code = "pass " + code;
	id = "nick " + id;
	send_to_server(code);
	send_to_server(id);
}

/*
	@brief 채팅 서버로 메세지 전송
	@detail 서버로 보내는 메세지의 끝은 "\n" 을 추가해서 알린다 (IRC RFC)
*/
void	IrcClient::send_to_server(const std::string &msg)
{
	return _socket->send_msg((msg + "\n").c_str());
}

/*
	@brief 서버로 부터 메세지를 받아와서 출력한다.
	@detail 메세지가 끝나지 않은 경우 계속 이어붙여 나가서 파싱한다.
*/
void	IrcClient::recv_from_server()
{
	_socket->recv_msg();
	static std::string line_buffer = "";
	std::string line;
	std::istringstream iss(_socket->_buffer);
	std::string	sql;

	while (std::getline(iss, line)) // LF 제거
	{
		if (line.find("\r") != std::string::npos) // CR제거, 개행문자를 찾은경우 데이터가 끝까지 온 것
		{
			line = line.substr(0, line.size() - 1);
			if (line_buffer.length() != 0)
			{
				line_buffer = line_buffer + line;
				this->parse_chat(line_buffer);
				line_buffer = "";
			}
			else
				this->parse_chat(line);
		} else { // 개행문자를 못찾은경우, 다음 데이터를 기다린다.
			line_buffer = line_buffer + line;
		}
	}
}

std::string		parse_id(const std::string &msg)
{
	size_t	idx;

	idx = msg.find_first_of('!', 0);
	if (idx == std::string::npos)
		throw (IrcError("parse_nick error | " + msg));
	return (msg.substr(1, idx - 1));
}

std::string		parse_channel(const std::string &msg)
{
	size_t	idx;
	size_t	idx_end;

	idx = msg.find_first_of('#', 0);
	if (idx == std::string::npos)
		throw (IrcError("parse_channel error | " + msg));
	idx_end = msg.find_first_of(' ', idx);
	if (idx_end == std::string::npos)
		throw (IrcError("parse_channel ' ' not found error | " + msg));
	return (msg.substr(idx + 1, idx_end - (idx + 1)));
}

std::string		parse_content(const std::string &msg)
{
	std::string		ret;
	size_t	idx;

	idx = msg.find_first_of(':', 1);
	if (idx == std::string::npos)
		throw (IrcError("parse_content ':' not found error | " + msg));
	ret = msg.substr(idx + 1, msg.length() - (idx + 1));
	ret = replace_special_characters(ret);
	return (ret);
}

std::string		parse_command(const std::string &msg)
{
	size_t		idx;
	size_t		idx_end;

	idx = msg.find_first_of(' ', 0);
	if (idx == std::string::npos)
		throw (IrcError("Invalid message recv (Can't split): " + msg));
	idx_end = msg.find_first_of(' ', idx + 1);
	if (idx_end == std::string::npos)
		idx_end = msg.length();
	return (msg.substr(idx + 1, idx_end - (idx + 1)));
}

bool		is_ping_check(const std::string &msg)
{
	size_t	idx;

	idx = msg.find("PING", 0);
	if (idx == 0)
		return true;
	return false;
}

static bool		is_bot(const std::string &id)
{
	if (id == "ssakddok" || id == "nightbot")
		return true;
	return false;
}

/*
	@brief parse message to nick, content
*/
void	IrcClient::parse_chat(const std::string &msg, bool log)
{
	static int function_counter = 0;
	std::string sql;
	std::string	cmd;
	t_chat	chat;

	if (log)
	{
		std::cout << " Insert " << function_counter << " queries." << std::endl;
		function_counter = 0;
		return ;
	}
	try
	{
		cmd = parse_command(msg);
		if (cmd == "PRIVMSG")
		{
			chat.id = parse_id(msg);
			if (is_bot(chat.id))
				return ;
			chat.channel = parse_channel(msg);
			chat.content = parse_content(msg);
			if (chat.content.length() > 256)
				chat.content = chat.content.substr(0, 255);
			this->_chat_storage.add(chat.channel, chat.content);
			this->_chat_storage.insert_to_db(this->_stmt);
			++function_counter;
		}
		else if (is_ping_check(msg))
			send_to_server("PONG");
		return ;
	}
	catch (IrcError const &e)
	{
		std::cerr << "[-] ";
		std::cerr << e.what() << std::endl;
	}
	catch (sql::SQLException const &e)
	{
		std::cerr << "[-] ";
		std::cerr << e.what() << std::endl;
		this->_chat_storage.clear();
	}
}
