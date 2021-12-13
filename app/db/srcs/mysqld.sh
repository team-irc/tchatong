mysql_install_db --user=root --datadir=/var/lib/mysql
mysqld --user=root --bootstrap --verbose=0 < /dbconfig/init_db.sql
mysqld --init_file=/dbconfig/create_table.sql
