#include "SocketDisconnectError.hpp"

SocketDisconnectError::SocketDisconnectError(std::string const &msg) : _msg(msg)
{
}

const char * SocketDisconnectError::what() const throw()
{
	return (_msg.c_str());
}

SocketDisconnectError::~SocketDisconnectError() throw () {};