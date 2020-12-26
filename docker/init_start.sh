#! /bin/bash
project_name=$(echo `ls /home/ossyy/*.jar ` |xargs basename)
java -Xms512m -Xmx512m -Duser.timezone=GMT+08 -Xbootclasspath/a:/home/ossyy/config -jar /home/ossyy/${project_name}
