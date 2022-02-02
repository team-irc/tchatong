#pragma once

#include <vector>
#include <string>
#include <iostream>
#include "cppconn/statement.h"

class ChatStorage {
private:
	std::vector<std::string>	_chat_storage;
public:
	ChatStorage();
	~ChatStorage();
public:
	void add(const std::string &channel, const std::string &content);
	void insert_to_db(sql::Statement *_stmt);
	void clear();
};
