package com.tong.ossyy.webservice;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService
public interface DemoService {
	@WebMethod
	String sayHello(@WebParam(name = "name")String user);
}
