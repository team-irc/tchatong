#!/bin/sh

# twchat 디렉토리가 없다면 초기화 후 생성
if [ ! -d /var/lib/mysql/twchat ]; then
  mysql_install_db --user=root --datadir=/var/lib/mysql
  mysqld --user=root --bootstrap --verbose=0 < /dbconfig/init_db.sql
  mysqld --init_file=/dbconfig/create_table.sql
else
  mysqld
fi
