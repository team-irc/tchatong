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
	sql::mysql::MySQL_Driver *driver;
	const char	*DB_HOST = std::getenv("DB_HOST");
	const char	*DB_USER = std::getenv("DB_USER");
	const char	*DB_PASS = std::getenv("DB_PASSWORD");
	const char	*DB_NAME = std::getenv("DB_NAME");

	driver = sql::mysql::get_mysql_driver_instance();
	_con = driver->connect("db:3306", DB_USER, DB_PASS);
	_stmt = _con->createStatement();
}

void		IrcClient::init_db()
{
	_stmt->execute("CREATE DATABASE IF NOT EXISTS twchat;");
	_stmt->execute("USE twchat;");
	_stmt->execute("CREATE TABLE IF NOT EXISTS streamer(\
									id int NOT NULL auto_increment primary key,\
									streamer_id VARCHAR(32) NOT NULL);");
	_stmt->execute("CREATE TABLE IF NOT EXISTS chatlog(\
									streamer_id VARCHAR(32) NOT NULL,\
									date TIMESTAMP DEFAULT NOW(),\
									user_id VARCHAR(32) NOT NULL,\
									content VARCHAR(256)\
	);");
}
/*
	@brief connect to twitch server socket when construct client
*/
IrcClient::IrcClient()
{
	char	sql[1024];

	_socket = new IrcSocket();
	connect_db();
	init_db();
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

	res = _stmt->executeQuery("SELECT streamer_id FROM streamer;");
	while (res->next())
	{
		// std::cout << "JOIN #" << res->getString("streamer_id") << std::endl;
		send_to_server("JOIN #" + res->getString("streamer_id"));
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
	@todo	코드 이해가 필요한 부분
*/
void	IrcClient::recv_from_server()
{
	std::string buffer = _socket->recv_msg();
	std::string line;
	std::istringstream iss(buffer);
	std::string	sql;

	while (std::getline(iss, line))
	{
		if (line.find("\r") != std::string::npos)
			line = line.substr(0, line.size() - 1);
		parse_chat(line);
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

bool		is_ping_check(const std::string &msg)
{
	size_t	idx;

	idx = msg.find("PING", 0);
	if (idx == 0)
		return true;
	return false;
}

/*
	@brief parse message to nick, content
*/
void	IrcClient::parse_chat(const std::string &msg)
{
	std::string sql;
	t_chat	chat;

	try
	{
		if (is_ping_check(msg))
		{
			send_to_server("PONG");
			return ;
		}
		chat.id = parse_id(msg);
		chat.channel = parse_channel(msg);
		chat.content = parse_content(msg);
		sql = "INSERT INTO chatlog VALUES('" + chat.channel + "', default, '" + chat.id + "', '" + chat.content;
		sql += "');";
		// std::cout << "sql: " << sql << std::endl;
		_stmt->execute(sql.c_str());
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
	}
}
