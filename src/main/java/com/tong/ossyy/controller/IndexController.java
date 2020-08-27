package com.tong.ossyy.controller;


import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


import com.tong.ossyy.Consts;
import com.tong.ossyy.user.User;
import com.tong.ossyy.user.UserService;
import com.tong.ossyy.util.ResultJson;
import com.tong.ossyy.util.VerifyCodeUtil;

@Controller
public class IndexController {
	private static final Logger logger = LogManager.getLogger(IndexController.class);
	@Resource
    UserService userService;


    @RequestMapping("/")
    public String index() {
        return "index/login";
    }
    
    @RequestMapping("/forget")
    public String forget() {
        return "index/forget";
    }

    @RequestMapping("/verifycode")
    public void verifycode(HttpServletRequest request, HttpServletResponse response) {
    	VerifyCodeUtil vcode=new VerifyCodeUtil();
        String verifyCode = vcode.getVcode();
        BufferedImage osimg;
		try {
			osimg = vcode.generateVerifyImg();
		} catch (IOException e) {
			e.printStackTrace();
			osimg=null;
		}
		HttpSession session = request.getSession();
		// 将验证码存入Session
		session.removeAttribute(Consts.VERIFY_SESSIONKEY);
		session.setAttribute(Consts.VERIFY_SESSIONKEY, verifyCode);
		
		// 将图片输出给浏览器
		BufferedImage image = (BufferedImage) osimg;
		response.setContentType("image/png");
		response.setHeader("Pragma", "No-cache");// 设置响应头信息，告诉浏览器不要缓存此内容
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expire", 0);
		// 将内存中的图片通过流动形式输出到客户端
		try {
			ImageIO.write(image, "png", response.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
    }
    
    
    @PostMapping("/login")
    @ResponseBody
    public ResultJson<Object> login(Model model,HttpServletRequest request, HttpServletResponse response) {
    	HttpSession session = request.getSession();
    	if(session==null){
    		return Consts.LOGIN_ERROR_RESULT;
    	}
    	String oldvercode=((String) session.getAttribute(Consts.VERIFY_SESSIONKEY)).toLowerCase();
    	String username=request.getParameter("username");
    	String password=request.getParameter("password");
    	String vercode=request.getParameter("vercode").toLowerCase();
    	
    	Map<String, String>data=new HashMap<String, String>();
    	ResultJson<Object> resultJson= new ResultJson<Object>(Consts.LOGIN_ERROR_RESULT);
    	User user=null;
    	try{
    		user=userService.getUserByLoginName(username);
    	}catch (Exception e) {
			logger.error(e);
		}
    	
        if(user != null){
        	if(oldvercode.equals(vercode)){
        		if(user.getPassword().equals(DigestUtils.md5DigestAsHex(password.getBytes()))){
        			session.setAttribute(Consts.LOGINKEY, username);
        			logger.info(username+"登陆成功");
        			data.put("msg", "登陆成功");
        			resultJson.setStatus(Consts.SUCCSS_RESULT);
                	resultJson.setData(data);
            	}else{
            		logger.info(username+"账号或密码错误");
            		data.put("msg", "账号或密码错误！");
                	resultJson.setData(data);
            	}	
        	}else{
        		logger.info(username+"验证码不正确");
        		data.put("msg", "验证码不正确！");
            	resultJson.setData(data);
        	}
        	
        }else{
        	logger.info(username+"账号或密码错误");
        	data.put("msg", "账号或密码错误！");
        	resultJson.setData(data);
        }
    	
    	return resultJson;
    }
    
    
}
