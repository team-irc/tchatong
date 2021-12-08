#include "utils.hpp"
#include <iostream>

static std::string		remember_to_buf(std::string &remember)
{
	std::string		result;
	
	for (int i = 0; i < remember.length(); i++)
	{
		if (remember.at(i) != ASCII_CONST::CR && remember.at(i) != ASCII_CONST::LF)
			result += remember.at(i);
		else
		{
			result += ASCII_CONST::LF;
			if (remember.at(i) == ASCII_CONST::CR &&
				(i + 1) < remember.length() && remember.at(i + 1) == ASCII_CONST::LF)
				i++;
			remember = remember.substr(i + 1);
			return (result);
		}
	}
	remember.clear();
	return (result);
}

int	read_until_crlf(int fd, char *buffer, int *len)
{
	int					i = 0;
	int					read_size = 0;
	int					insert_idx = 0;
	char				buf[UTILS::BUFFER_SIZE + 1];
	static std::string	remember[UTILS::OPEN_MAX_FD];
	int					rem_size = 0;

	memset(buf, 0, UTILS::BUFFER_SIZE);
	if (!remember[fd].empty())
	{
		std::string	result = remember_to_buf(remember[fd]);
		rem_size = result.length();
		strncpy(buf, result.c_str(), rem_size);
		insert_idx = rem_size;
	}
	while (insert_idx < UTILS::BUFFER_SIZE)
	{
		std::cout << "1" << std::endl;
		if (remember[fd].empty())
		{
			std::cout << "2" << std::endl;
			if ((read_size = read(fd, buf + insert_idx, UTILS::BUFFER_SIZE - insert_idx)) == -1)
			{
				std::cout << "3" << std::endl;
				break;
			}
			else if (read_size == 0)
			{
				std::cout << "4" << std::endl;
				break;
			}
			std::cout << "5" << std::endl;
			buf[insert_idx + read_size] = 0;
		}
		else
		{
			if (insert_idx >= 1 && buf[insert_idx - 1] != '\n')
			{
				std::string	result = remember_to_buf(remember[fd]);
				rem_size = result.length();
				strncpy(buf + insert_idx, result.c_str(), rem_size);
				insert_idx += rem_size;
			}
		}
		for (i = 0; i < read_size + rem_size; i++)
		{
			if (buf[i] == ASCII_CONST::CR || buf[i] == ASCII_CONST::LF)
			{
				if (rem_size == 0)
				{
					strncpy(buffer, buf, i + 1);
					buffer[i + insert_idx + 1] = 0;
					if (buffer[i] == '\r')
						buffer[i] = '\n';
				}
				else
				{
					strncpy(buffer, buf, i + 1);
					buffer[i + 1] = 0;
					if (buffer[i] == '\r')
						buffer[i] = '\n';
				}
				if (buf[i + 1] == ASCII_CONST::LF)
					++i;
				for (int j = 1; buf[i + j]; ++j)
					remember[fd] += buf[i + j];
				*len = i + insert_idx;
				if (remember[fd].empty())
					return (0);
				return (1);
			}
		}
		rem_size = 0;
		remember[fd] += buf;
		return (2);
	}
	for (int i = 0; buf[i] != 0; i++)
	{
		buffer[i] = buf[i];
	}
	buffer[insert_idx] = 0;
	*len = insert_idx;
	if (remember[fd].empty())
		return (0);
	else
		return (1);
}
