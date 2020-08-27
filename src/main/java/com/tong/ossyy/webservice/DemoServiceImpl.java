package com.tong.ossyy.webservice;

import java.util.Date;

import javax.jws.WebService;
import org.springframework.stereotype.Service;

@Service
@WebService(serviceName = "DemoService", // 与接口中指定的name一致
        targetNamespace = "http://webservice.ossyy.tong.com", // 与接口中的命名空间一致,一般是接口的包名倒
        endpointInterface = "com.tong.ossyy.webservice.DemoService"// 接口地址
)
public class DemoServiceImpl implements DemoService{

	@Override
	public String sayHello(String user) {
		return user+"，现在时间："+"("+new Date()+")";
	}

}
