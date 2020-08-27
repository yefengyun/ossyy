package com.tong.ossyy.controller;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tong.ossyy.Consts;
import com.tong.ossyy.interceptor.LoginRequired;
import com.tong.ossyy.user.User;
import com.tong.ossyy.user.UserService;
import com.tong.ossyy.util.ResultJson;
 
/**
 * @author Wofeiworenxing
 *用户信息控制类
 */

@RestController
@RequestMapping("user")
public class UserController {
	@Autowired
	UserService userService;
	
	
	 /**
     * 添加
     * @return
     */
    @RequestMapping("insert")
	@ResponseBody
    public ResultJson<Object> insert(){
        User user = new User();
        user.setId(2);
        user.setActive(1);
        user.setDatejoined(new Date(System.currentTimeMillis()));
        user.setEmail("yefengyun241@163.com");
        user.setFirstname("张山");
        user.setLastlogin(new Date(System.currentTimeMillis()));
        user.setLastname("12324567890");
        user.setPassword("456.com");
        user.setPhone("13162283395");
        user.setUsername("zhangshan");
        user.setRoleid("1");
        user.setStaff(1);
        userService.insertUser(user);
        ResultJson<Object> resultJson= new ResultJson<Object>(Consts.SUCCSS_RESULT);
        resultJson.setMsg("SUCCESS");
        return resultJson;
    }
    
    /**
     * 查询
     * @return
     */
    @RequestMapping("getUser")
    @LoginRequired
    public User getUser(){
        return userService.getUserById(1);
    }
    

}
