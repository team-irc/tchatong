#include "IrcError.hpp"

IrcError::IrcError(std::string const &msg) : _msg(msg)
{
}

const char * IrcError::what() const throw()
{
	return (_msg.c_str());
}

IrcError::~IrcError() throw () {};