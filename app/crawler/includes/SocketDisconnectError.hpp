#pragma once

#include <exception>
#include <string>

class SocketDisconnectError : std::exception
{
private:
	const std::string	_msg;

public:
	SocketDisconnectError(std::string const &msg);
	virtual ~SocketDisconnectError() throw();
	virtual const char *what() const throw();
};