#! /bin/bash
project_name=$(echo `ls /home/ossyy/*.jar ` |xargs basename)
java -Xms512m -Xmx512m -Duser.timezone=GMT+08 -jar /home/ossyy/${project_name}
