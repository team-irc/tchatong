#include "../includes/ChatStorage.hpp"
#include <ctime>

/*
 *  @brief 현재 시간을 UTC 형식으로 반환
 *  @return "2022-01-30 09:32:25"
 */
std::string get_current_UTC_time()
{
	std::time_t now= std::time(0);
	std::tm* now_tm= std::gmtime(&now);
	char buf[42];
	std::strftime(buf, 42, "%Y-%m-%d %X", now_tm);
	return buf;
}

ChatStorage::ChatStorage() {}
ChatStorage::~ChatStorage() {}

void ChatStorage::add(const std::string &channel, const std::string &content) {
	//('" + chat.channel + "', default, '" + chat.content + "')
	this->_chat_storage.push_back("('" + channel + "', '" + get_current_UTC_time() + "', '" + content + "')");
}

void ChatStorage::insert_to_db(sql::Statement *stmt) {
	if(this->_chat_storage.size() <= 50) return ;
	std::vector<std::string>::iterator	it;
	std::vector<std::string>::iterator	end;
	std::string							query;

	it = this->_chat_storage.begin();
	end = this->_chat_storage.end();
	query = "INSERT INTO chatlog VALUES";
	while(it != end) {
		query += " " + *it + ",";
		++it;
	}
	query.back() = ';';
	stmt->execute(query.c_str());
	// std::cout << query << std::endl;
	this->_chat_storage.clear();
}

void ChatStorage::clear() {
	this->_chat_storage.clear();
}