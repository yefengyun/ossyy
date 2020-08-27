FROM java:8

MAINTAINER 8577

LABEL description="ossyy" \
      name="ossyy" \
      version="0.0.1"


# mkdir base path
RUN mkdir -p /home/ossyy \
	mkdir -p /var/log/ossyy

#change datazone
COPY Shanghai /etc/localtime

#copy program
COPY ossyy-0.0.1.jar /home/ossyy/ossyy-0.0.1.jar

#copy init start shell
COPY init_start.sh /home/ossyy/init_start.sh

#change permission
RUN chmod 777 /home/ossyy/init_start.sh

#export port
EXPOSE 8080

ENTRYPOINT ["/home/ossyy/init_start.sh"]

