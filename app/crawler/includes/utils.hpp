#pragma once

#include <string.h>
#include <unistd.h>

namespace UTILS
{
	const int		BUFFER_SIZE = 200;
	const int		OPEN_MAX_FD = 1;
}

int	read_until_crlf(int fd, char *buffer, int *len);

namespace	ASCII_CONST
{
	const char		CR = 13;
	const char		LF = 10;
};
